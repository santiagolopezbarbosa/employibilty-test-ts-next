# 🧪 Prueba Técnica – Evaluación de Empleabilidad  
**Stack:** TypeScript + Next.js 15  
**API:** Rick and Morty (https://rickandmortyapi.com)  
**Modalidad:** Individual  
**Duración sugerida:** 6 a 8 horas  

---

## 📌 Contexto

Has sido incorporado/a a un equipo de desarrollo que mantiene una aplicación web construida con **Next.js 15 y TypeScript**.  
La aplicación consume datos públicos de la **API de Rick and Morty** para mostrar información de personajes.

El proyecto **funciona de forma parcial**, pero presenta múltiples problemas reales que suelen encontrarse en proyectos existentes:

- Errores de lógica
- Tipado deficiente o inexistente
- Mala organización de carpetas
- Mezcla de responsabilidades
- Uso incorrecto de datos de la API
- Falta de manejo de estados (loading / error)

Este ejercicio **NO consiste en crear una app desde cero**, sino en **analizar, corregir y mejorar código existente**, tal como ocurre en un entorno laboral real.

---

## 🎯 Objetivo del Ejercicio

Evaluar tu capacidad para:

- Leer y comprender código ajeno
- Identificar errores reales
- Tomar decisiones técnicas justificadas
- Refactorizar con criterio profesional
- Usar TypeScript correctamente
- Organizar un proyecto Next.js de forma mantenible

---

## 🛠️ Tu Tarea

Debes trabajar sobre este repositorio y:

### 1️⃣ Análisis
- Revisar el proyecto existente
- Identificar problemas de:
  - Lógica
  - Tipado
  - Arquitectura
  - Buenas prácticas

### 2️⃣ Corrección y Refactorización
- Corregir errores de ejecución y renderizado
- Refactorizar el código para mejorar:
  - Legibilidad
  - Mantenibilidad
  - Separación de responsabilidades

### 3️⃣ TypeScript
- Eliminar el uso innecesario de `any`
- Definir interfaces o tipos para:
  - Respuestas de la API
  - Props de componentes
  - Funciones y helpers
- Garantizar que el proyecto compile **sin errores de TypeScript**

### 4️⃣ Consumo de API
- Consumir la API de Rick and Morty de forma correcta
- Centralizar el consumo en un servicio
- Manejar adecuadamente:
  - Estados de carga
  - Errores
  - Datos vacíos

---

## 🌐 Alcance Funcional Mínimo

La aplicación debe, como mínimo:

- Mostrar una lista de personajes
- Renderizar por personaje:
  - Nombre
  - Imagen
  - Especie
  - Estado
- Funcionar sin errores de consola
- Compilar correctamente con TypeScript

> 🔹 La navegación a detalle de personaje es **opcional**, pero será valorada positivamente.

---

## 📂 Reglas Importantes

### 🚫 NO está permitido
- Reescribir el proyecto desde cero
- Eliminar funcionalidades existentes sin justificación
- Ignorar TypeScript o desactivar validaciones
- Dejar errores o warnings de compilación
- Copiar soluciones externas sin comprenderlas

### ✅ SÍ está permitido
- Reorganizar carpetas
- Crear nuevos archivos (services, types, components, etc.)
- Mejorar la estructura del proyecto
- Agregar manejo de errores y estados
- Tomar decisiones técnicas propias (siempre que estén justificadas)

---

## 📦 Entregables

Debes entregar:

### 1️⃣ Código
- Repositorio con el proyecto corregido y refactorizado
- El proyecto debe:
  - Ejecutar correctamente
  - Compilar sin errores
  - Mantener una estructura clara

### 2️⃣ README (obligatorio)
Agrega o completa este README con una sección donde expliques:

- Principales problemas encontrados
- Decisiones técnicas tomadas
- Qué mejorarías si tuvieras más tiempo
- Dificultades enfrentadas (si las hubo)

---

## 🧠 Criterios de Evaluación

Serás evaluado/a en aspectos como:

- Comprensión del código existente
- Uso correcto de TypeScript
- Arquitectura del proyecto
- Manejo de lógica y estados
- Calidad y claridad del código
- Mentalidad profesional y comunicación técnica

> ⚠️ No se evalúa “qué tan bonito se ve”, sino **qué tan mantenible y profesional es el código**.

---

## 💬 Nota Final

Este ejercicio simula una situación real de trabajo.  
No se espera perfección, sino **criterio, claridad y capacidad de mejora**.

Piensa siempre:
> *“¿Cómo dejaría este proyecto para que otro desarrollador pueda continuarlo sin problemas?”*

Éxitos 🚀

---

## 🧾 Informe de Refactorización (Entrega)

### Problemas detectados en el código original

- **Consumo de API incorrecto**
  - En algunas páginas se guardaba la respuesta completa en estado (objeto con `{ info, results }`) en lugar de `results`.
  - Había `fetch` duplicado en diferentes pantallas en vez de centralizar.
- **Tipado débil / uso de `any`**
  - `useState<any>` y `catch (err: any)` en componentes clave.
  - Helpers con parámetros sin tipo.
- **Dependencia usada pero no instalada**
  - `styled-components` se importaba en `Card` pero no estaba en `package.json`, lo que impedía compilar.
- **Estructura confusa en rutas**
  - Existe una ruta `home)` (nombre inválido/accidental) que genera `/home)` y rompe el regex de Next en dev.

### Decisiones técnicas tomadas durante la refactorización

- **Centralizar el consumo de API**
  - Crear `src/services/api.ts` con `requestJson<T>` genérico y `getCharacters()` tipado.
  - Validar `response.ok` para lanzar errores HTTP claros.
- **Tipado compartido**
  - Definir `src/types/rickMorty.ts` con `Character`, `RickMortyPaginatedResponse<T>`, etc.
  - Usar `Pick<Character, 'name' | 'status'>` para desacoplar componentes del modelo completo.
- **Eliminar dependencias implícitas**
  - Remover `styled-components` del `Card` y reemplazar por JSX con estilos inline.
- **Estados consistentes**
  - Reutilizar `LoadingState` en todas las páginas.
  - Agregar `error` y `empty` para cubrir todos los casos.
- **Setup de Next/TS**
  - Crear `next-env.d.ts` y ajustar `.gitignore` para permitirlo.
  - Corregir `package.json` para alinear `@types/react` con React 18.

### Justificación de los cambios realizados

- **Centralización de API**
  - Evita duplicación y facilita testing/mock. `requestJson<T>` permite reutilizar el mismo patrón para otros endpoints.
- **Tipado fuerte**
  - Reducir `any` disminuye errores en runtime y mejora autocompletado/refactor.
  - `Pick<Character, ...>` evita que cambios futuros en el modelo rompan componentes innecesariamente.
- **Estados unificados**
  - Usar `LoadingState` compartido mantiene coherencia visual y facilita cambios globales.
  - `error` y `empty` garantizan que la UI siempre responda con algo útil.
- **Eliminación de `styled-components`**
  - No estaba en `package.json`, por lo que el proyecto no compilaba. La solución inline mantiene funcionalidad sin añadir dependencias.
- **Setup de Next/TS**
  - `next-env.d.ts` es necesario para que Next aporte sus tipos (`ImageMetadata`, etc.).
  - Alinear `@types/react` a la misma versión de React evita errores de tipos incompatibles.
- **Rutas limpias**
  - Corregir `home)` a `home` evita errores de regex y hace el routing predecible.

### Estilos aplicados a las páginas

#### Motivo
- **Experiencia de usuario**: Las páginas originales no tenían estilos, lo que resultaba en una presentación cruda y poco profesional.
- **Cohesión visual**: Unificar la apariencia entre las rutas principales (`/`, `/home`, `/dashboard`) con un sistema de colores y espaciado consistente.
- **Accesibilidad y responsividad**: Usar CSS Grid y Flexbox para layouts adaptables sin depender de frameworks CSS.

#### Cambio realizado
- **`src/app/page.tsx` (home principal)**
  - Se agregó un contenedor centrado con fondo claro (`#f8fafc`).
  - Header centrado con título y subtítulo.
  - Grid responsivo para las tarjetas (`repeat(auto-fill, minmax(280px, 1fr))`).
  - Sin dependencias externas: estilos inline en objeto `styles`.

- **`src/app/home/page.tsx` (ruta secundaria)**
  - Mismos estilos que la página principal para mantener consistencia.
  - Título “Home” para diferenciar visualmente.

- **`src/app/dashboard/page.tsx`**
  - Se eliminaron clases de Bootstrap (`container`, `row`, `col-*`, `card`, etc.).
  - Se implementó:
    - Grid de estadísticas con tarjetas centradas y colores diferenciados (Alive: verde, Dead: rojo, Unknown: gris).
    - Filtros en línea con inputs y selects estilizados.
    - Grid de personajes con badges de estado y especie.
    - Mensaje de “No se encontraron resultados” estilizado.
  - Colores y espaciado alineados con las otras páginas.

#### Impacto
- Las páginas ahora presentan una interfaz limpia, moderna y usable.
- Se mantiene la tipado fuerte y la separación de responsabilidades (sin CSS-in-JS ni librerías externas).
- El layout es responsivo y accesible por defecto.

### Animaciones y tipografía mejorada

#### Motivo
- **Experiencia de usuario**: Las animaciones sutiles mejoran la percepción de velocidad y profesionalismo.
- **Legibilidad**: Una tipografía moderna y consistente (Inter) mejora la lectura en todos los dispositivos.
- **Branding**: Fuente personalizada y animaciones refuerzan identidad visual sin añadir dependencias pesadas.

#### Cambio realizado
- **`src/app/layout.tsx`**
  - Se agregaron enlaces a Google Fonts para la familia Inter (weights 400, 500, 600, 700).
  - `preconnect` para optimizar carga.

- **`src/app/page.tsx` y `src/app/home/page.tsx`**
  - Animación `fadeInUp` con `style jsx` para las tarjetas.
  - Stagger: cada tarjeta aparece con un retraso de `index * 0.1s`.
  - Tipografía Inter aplicada a `container`, `title`, `subtitle`.

- **`src/app/dashboard/page.tsx`**
  - Animación `fadeInUp` en las tarjetas de personajes con `index * 0.05s` (más rápido por ser más densas).
  - Tipografía Inter en todo el componente (incluyendo inputs, badges y textos).
  - Sin cambios funcionales, solo presentación.

#### Detalles técnicos
- **Animación**: `@keyframes fadeInUp` desde `opacity: 0, translateY(20px)` hasta `opacity: 1, translateY(0)`.
- **Duración**: 0.5s con `ease-out`.
- **Tipografía**: Stack con fallback a system fonts para compatibilidad.
- **No dependencias**: Se usa `style jsx` (incluido en Next.js) y Google Fonts (CDN).

#### Impacto
- La carga de personajes se percibe más fluida y profesional.
- Mejora la legibilidad y consistencia visual en toda la app.
- Sin impacto en el bundle ni en el tipado existente.

### Propuestas de mejora futura

- **Mejorar arquitectura de UI**
  - Extraer componentes de “lista de personajes” y “card de personaje” reutilizables.
- **TypeScript más estricto**
  - Activar `strict: true` progresivamente (con plan de adopción) para prevenir regresiones.
- **Observabilidad**
  - Mejorar mensajes de error (por ejemplo, mapear errores HTTP a UI más amigable).

### Eliminación de login y register

#### Motivo
- **Alcance del proyecto**: El objetivo del proyecto es consumir y mostrar datos de la API de Rick and Morty. No se requiere autenticación ni gestión de usuarios.
- **Complejidad innecesaria**: Mantener rutas de login/register sin backend ni persistencia añade código muerto y confusión.
- **Enfoque en la refactorización**: Eliminar estas rutas permite centrarse en los problemas reales (tipado, consumo de API, estados) sin distraer con funcionalidades no utilizadas.

#### Cambio realizado
- Se eliminaron los directorios `src/app/login` y `src/app/register` y todo su contenido.
- No afecta a las rutas funcionales (`/`, `/home`, `/dashboard`) ni al consumo de la API.

### Cambios realizados (resumen)

- **Servicios y tipos**
  - `src/services/api.ts`: `requestJson<T>` + retorno de datos tipados.
  - `src/types/rickMorty.ts`: modelos de la API.
- **Páginas**
  - `src/app/page.tsx`, `src/app/home)/page.tsx`, `src/app/dashboard/page.tsx`: uso de `getCharacters()`, sin `any`, con `loading/error/empty`.
- **Helpers/UI**
  - `src/utils/helpers.ts`: tipado de `isAlive`.
  - `src/components/CharacterCard.tsx`: props tipadas.

### Cambios realizados (detalle técnico)

#### 1. `src/types/rickMorty.ts` (nuevo archivo)
- **Motivo:** No existía tipado compartido para la API.
- **Contenido:**
  ```ts
  export type CharacterStatus = 'Alive' | 'Dead' | 'unknown' | (string & {});
  export interface Character {
    id: number;
    name: string;
    status: CharacterStatus;
    species: string;
    image: string;
  }
  export interface RickMortyPageInfo { … }
  export interface RickMortyPaginatedResponse<T> { info: RickMortyPageInfo; results: T[]; }
  ```
- **Impacto:** Todas las páginas y el servicio ahora comparten el mismo modelo, evitando errores de shape.

#### 2. `src/services/api.ts` (refactor)
- **Antes:**
  ```ts
  export async function getCharacters() {
    const response = await fetch("https://rickandmortyapi.com/api/character")
    return response
  }
  ```
- **Después:**
  ```ts
  async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, init);
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    return (await response.json()) as T;
  }

  export async function getCharacters() {
    const data = await requestJson<RickMortyPaginatedResponse<Character>>(
      `${API_BASE_URL}/character`
    );
    return data.results;
  }
  ```
- **Cambios clave:**
  - Centralización del endpoint (`API_BASE_URL`).
  - Validación HTTP (`response.ok`).
  - Tipado de respuesta (`RickMortyPaginatedResponse<Character>`).
  - Retorna solo `results` (el arreglo de personajes), no el objeto completo.

#### 3. `src/app/page.tsx` (home principal)
- **Antes:**
  ```ts
  const [characters, setCharacters] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch("https://rickandmortyapi.com/api/character")
      .then(res => res.json())
      .then(data => {
        setCharacters(data) //  guardaba el objeto { info, results }
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Cargando...</p>
  ```
- **Después:**
  ```ts
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true
    const load = async () => {
      try {
        setLoading(true); setError(null);
        const results = await getCharacters(); //  usa servicio tipado
        if (!isActive) return;
        setCharacters(results);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error inesperado';
        if (!isActive) return;
        setError(message);
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    };
    load();
    return () => { isActive = false };
  }, [])

  if (loading) return <LoadingState />;
  if (error) return <p>Error: {error}</p>;
  if (characters.length === 0) return <p>No hay personajes para mostrar.</p>;
  ```
- **Cambios clave:**
  - Tipado `Character[]`.
  - Consumo centralizado (`getCharacters()`).
  - Manejo de `error` y `empty`.
  - Cleanup con `isActive` para evitar memory leaks.
  - Uso de `LoadingState` compartido.

#### 4. `src/app/home/page.tsx` (ruta secundaria)
- **Cambios idénticos a `/`** para mantener consistencia.
- **Nota:** Antes existía una carpeta inválida `home)` que causaba errores de regex en Next; se corrigió a `home`.

#### 5. `src/app/dashboard/page.tsx`
- **Antes:**
  ```ts
  const [stats, setStats] = useState<any>({});

  const fetchCharacters = async () => {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data: ApiResponse = await response.json();
    setCharacters(data.results);
    setFilteredCharacters(data.results);
    calculateStats(data.results);
  } catch (err: any) {
    setError(err.message || 'Error inesperado');
  }
  ```
- **Después:**
  ```ts
  interface CharacterStats { total: number; alive: number; dead: number; unknown: number; }
  const [stats, setStats] = useState<CharacterStats>({ total: 0, alive: 0, dead: 0, unknown: 0 });

  const fetchCharacters = async () => {
    try {
      setLoading(true); setError(null);
      const results = await getCharacters();
      setCharacters(results);
      setFilteredCharacters(results);
      calculateStats(results);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  ```
- **Cambios clave:**
  - `stats` tipado (`CharacterStats`).
  - `catch (err: unknown)` con guard `instanceof Error`.
  - Consumo de `getCharacters()` (centralizado).

#### 6. `src/components/Card.tsx`
- **Problema:** Usaba `styled-components` sin estar en `package.json`.
- **Solución:** Se reemplazó por JSX con estilos inline (sin dependencias externas).
- **Resultado:** Componente funcional y compilable.

#### 7. `src/components/CharacterCard.tsx`
- **Antes:**
  ```ts
  export default function CharacterCard(props) {
    return (
      <div>
        <h2>{props.name}</h2>
        <p>{props.status}</p>
      </div>
    )
  }
  ```
- **Después:**
  ```ts
  interface CharacterCardProps {
    character: Pick<Character, 'name' | 'status'>
  }
  export default function CharacterCard({ character }: CharacterCardProps) {
    return (
      <div>
        <h2>{character.name}</h2>
        <p>{character.status}</p>
      </div>
    )
  }
  ```
- **Cambios clave:**
  - Props tipadas (`CharacterCardProps`).
  - Usa `Pick<Character, 'name' | 'status'>` para evitar acoplamiento al modelo completo.

#### 8. `src/utils/helpers.ts`
- **Antes:**
  ```ts
  export function isAlive(status) {
    if(status === 'Alive') return true
    else return false
  }
  ```
- **Después:**
  ```ts
  export function isAlive(status: CharacterStatus): boolean {
    return status === 'Alive'
  }
  ```
- **Cambios clave:**
  - Parámetro tipado (`CharacterStatus`).
  - Lógica simplificada (retorno directo).

#### 9. `src/app/layout.tsx`
- **Problema:** Usaba `React.ReactNode` sin importar `React`.
- **Solución:** Se importó `ReactNode` desde `'react'`.

#### 10. `next-env.d.ts` y `.gitignore`
- **Problema:** Faltaban las directivas de tipos de Next y `next-env.d.ts` era ignorado.
- **Solución:**
  - Se creó `next-env.d.ts` con `/// <reference types="next" />`.
  - Se ajustó `.gitignore` para permitir el archivo (`!next-env.d.ts`).

#### 11. `package.json`
- **Problema:** `@types/react` tenía versión 19.x (incompatible con React 18).
- **Solución:** Se alineó a `^18.3.0` y se agregó `@types/react-dom`.

### Validación

- **Build**
  - `npm run build` compila correctamente.
- **Runtime**
  - `npm run dev` levanta sin errores de regex (ruta inválida corregida).
  - Listado de personajes carga con `LoadingState`, muestra datos y maneja `error`/`empty`.
- **API**
  - Verificado que `https://rickandmortyapi.com/api/character` responde `200` con `{ info, results }`.

### Propuestas de mejora futura

- **Mejorar arquitectura de UI**
  - Extraer componentes de “lista de personajes” y “card de personaje” reutilizables.
- **TypeScript más estricto**
  - Activar `strict: true` progresivamente (con plan de adopción) para prevenir regresiones.
- **Observabilidad**
  - Mejorar mensajes de error (por ejemplo, mapear errores HTTP a UI más amigable).
