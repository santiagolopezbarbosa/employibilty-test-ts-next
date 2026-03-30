# Documento Técnico de Código Fuente
**Norma:** 220501096 - Desarrollar la solución de software de acuerdo con especificaciones de diseño.
**Proyecto:** Sistema de Favoritos - Rick & Morty Full-Stack (Arquitectura Senior)

## 1. Estructura del proyecto
El proyecto sigue la convención de enrutamiento **App Router** recomendada por Next.js 15, aplicando patrones de diseño avanzados, separación de responsabilidades y guardias de seguridad para la sesión.

### Descripción de carpetas y módulos

* `/prisma/`: Contiene el esquema de la base de datos (`schema.prisma`), el archivo de SQLite (`dev.db`) y el script de inicialización con contraseñas encriptadas (`seed.ts`).
* `/src/app/`: Capa de ruteo y componentes UI.
  * `Providers.tsx`: Envoltorio de Contexto Global para inyectar la Session (NextAuth) y el QueryClient (TanStack).
  * `layout.tsx`: Define el HTML global y consume el `<Providers>`.
  * `/src/app/page.tsx`: Pantalla principal con **Scroll Infinito** y estado de caché.
  * `/src/app/favorites/page.tsx`: Pantalla privada con protección de rutas.
  * `/src/app/login/page.tsx`: Interfaz de autenticación por credenciales.
  * `/src/app/components/`: Componentes UI (ej. `Card.tsx`, `SkeletonCard.tsx`).
* `/src/app/api/`: **Backend / Route Handlers**.
  * `auth/[...nextauth]/route.ts`: Controlador de Sesiones JWT (JSON Web Tokens).
  * `favorites/route.ts`: Endpoints RESTful protegidos por validación de sesión (`getServerSession`).
* `/src/services/`: Capa de integración asíncrona.
  * `api.ts`: Cliente proxy hacia la API de Rick & Morty con soporte para **Paginación y Query params de servidor**.
  * `favorites.ts`: Promesas `fetch` de consumo REST hacia nuestro propio backend.
* `/src/lib/`:
  * `db.ts`: Instancia Singleton de PrismaClient.
  * `authOptions.ts`: Configuraciones desacopladas de NextAuth y BcryptJS.

---

## 2. Explicación del flujo del sistema moderno

1. **Autenticación Inicial:** Si un usuario no autenticado entra a `/` o `/favorites`, el sistema intercepta su estado (`status === "unauthenticated"`) y lo expulsa hacia `/login`. Al ingresar sus credenciales, se valida el Hash (Bcrypt) contra la DB y se le asigna un JWT.
2. **Carga Optimizada y Caché:** Al estar logeado en `/`, TanStack Query invoca `useInfiniteQuery`. En lugar de dejar cargando una pantalla blanca, el DOM dibuja una lista de componentes `<SkeletonCard/>` que pulsan sutilmente.
3. **Paginación e Intersección:** Al hacer scroll down, un `IntersectionObserver` invisible al fondo de la página detecta si es visible (`inView`). Si lo es, dispara `fetchNextPage()`, adjuntando la página #2 a la lista cacheada de personajes sin perder el scroll actual.
4. **Mutaciones Optimistas (Optimistic Updates):** Cuando el usuario presiona "Agregar a favoritos", el estado local de TanStack Query (`queryClient.setQueryData`) se engaña a sí mismo agregando el personaje inmediatamente a la lista local para que el icono se ilumine en 0ms. Simultáneamente, por debajo de la mesa, se ejecuta un POST a `/api/favorites`.
5. **Capa Backend y Persistencia:** El endpoint verifica el JWT. Si es válido, inserta relacionalmente bajo la regla de integridad referencial el ID del personaje apuntando al ID derivado del Token del usuario, devolviendo un HTTP `201 Created`. Si la petición falla, la Mutación Optimista "hace un rollback" en el cliente devolviéndolo a su estado original (Icono apagado).

---

## 3. Tecnologías y frameworks utilizados
* **Core:** Node.js v20+, TypeScript v5.
* **Framework Web:** Next.js 15.0.0 (App Router).
* **Base de Datos Relacional:** SQLite 3 (preparado para escalar a PostgreSQL).
* **Seguridad y Criptografía:** NextAuth.js (v4), BcryptJS, JSON Web Tokens.
* **Gestor de Caché Server-State:** TanStack React Query v5.
* **Observador del DOM:** react-intersection-observer.
* **ORM:** Prisma Client 6.x.

---

## 4. Fragmentos de código relevantes comentados y Buenas Prácticas

### 4.1. Inyección de Credenciales y Prevención de Endpoints
*Buena Práctica Aplicada: Nunca confiar en el cliente para determinar el dueño de los datos (ID spoofing).*
```typescript
// src/app/api/favorites/route.ts (Sección DELETE)
export async function DELETE(request: NextRequest) {
  try {
    // 1. Validar la procedencia de la sesión en el servidor
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // 2. Extraer el ID intrínseco del JWT con Type-Casting seguro
    const userId = parseInt((session.user as any).id, 10);
    const { apiCharacterId } = await request.json();

    // 3. Ejecutar borrado anclado fuertemente al Dueño
    const deleted = await prisma.favoriteCharacter.deleteMany({
      where: { userId, apiCharacterId },
    });
    // ...
```

### 4.2. Delegación Externa (Búsqueda Server-Side)
*Buena Práctica Aplicada: Filtrar 800 registros localmente consume CPU cliente. Derivar la responsabilidad al servidor externo mejora dramáticamente el First Input Delay.*
```typescript
// src/services/api.ts
export async function getCharacters({ page = 1, name = "", status = "" }: FetchParams) {
  const searchParams = new URLSearchParams();
  searchParams.append('page', page.toString());
  
  if (name) searchParams.append('name', name);
  if (status && status !== 'all') searchParams.append('status', status);

  // La API de Rick and Morty procesará el query string en su propio clúster backend.
  const data = await requestJson(
    `${API_BASE_URL}/character/?${searchParams.toString()}`
  );
  return data;
}
```

### 4.3. Implementación de Actualizaciones Optimistas (React Query)
*Buena Práctica Aplicada: Engañar la latencia de la red prediciendo el éxito para retener una experiencia "Instantánea" de UX.*
```tsx
// src/app/page.tsx
const handleToggleFavorite = useCallback(async (character: Character) => {
  const isCurrentlyFavorite = favoriteIds.has(character.id);
  
  // 1. Actualización Optimista (Síncrona) sobre Cache de Tanstack Query
  queryClient.setQueryData(['favorites'], (old: any) => {
    if (!old) return [];
    if (isCurrentlyFavorite) return old.filter((f: any) => f.apiCharacterId !== character.id);
    return [...old, { apiCharacterId: character.id }]; // Finge éxito exitoso inmediatamente
  });

  try {
    // 2. Ejecución asíncrona silenciosa (Network Request)
    if (isCurrentlyFavorite) await removeFavorite(character.id);
    else await addFavorite({ apiCharacterId: character.id, ... });
  } catch (err) {
    // 3. Rollback en caso de que la red callejera o base de datos falle
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  }
}, [favoriteIds, queryClient]);
```
