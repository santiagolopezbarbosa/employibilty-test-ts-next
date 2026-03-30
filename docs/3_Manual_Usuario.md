# Instructivo de Uso y Manual de Usuario
**Norma:** 220501096
**Proyecto:** Sistema de Favoritos - Rick & Morty Full-Stack (Arquitectura Senior)

## 1. Requisitos del sistema (Software)
Para que el entorno funcione localmente requiere tener instalado lo siguiente en su máquina:
* **Node.js**: Versión 18 o superior (Se recomienda 20.x LTS o superior).
* **NPM / Next.js**: Gestor de paquetes que se instala conjuntamente con Node.js.
* **Navegador Web**: Google Chrome, Mozilla Firefox o Microsoft Edge actualizados.

No se requiere instalar motores de bases de datos de sistema complejo (ej. SQL Server o PostgreSQL) dado que se implementó un motor **SQLite**, el cual ya viene embebido y gestionado por la aplicación mediante archivos locales.

## 2. Pasos de Instalación y Ejecución

Si se clona o de descarga este proyecto por primera vez, siga los siguientes pasos desde su terminal (o Símbolo de Sistema Powershell / CMD):

**Paso 1: Instalar Dependencias**
```bash
npm install
```

**Paso 2: Generar Base de Datos y Cliente ORM**
El siguiente comando lee el archivo `.prisma`, genera la Base de Datos e inicializa el cliente Prisma:
```bash
npx prisma db push
npx prisma generate
```

**Paso 3: Ejecutar Semilla (Seed) de Usuario y Contraseñas**
Dado que el sistema requiere de un usuario base encriptado por medidas de seguridad, ejecutamos la inicialización local:
```bash
npm run prisma:seed
node fix_pass.js
```

**Paso 4: Inicializar la Solución de Software**
Levantamos el ambiente de ejecución local de Next.js.
```bash
npm run dev
```
Luego ingrese a `http://localhost:3000` en su navegador.

---

## 3. Descripción de las funcionalidades y uso

El sistema cuenta con una interfaz inmersiva, fuertemente caracterizada (Glassmorphism Sci-Fi), y rutinas automatizadas de caché de datos.

### A. Autenticación Restringida (Secured Login)
Dado que la aplicación cuenta con perfiles independientes, el sistema lo expulsará obligatoriamente a una pantalla llamada "Autorización Requerida" (`/login`) si no ha iniciado sesión.
Para entrar y acceder al catálago interdimensional, debe utilizar sus credenciales:
* **Identificador Cósmico:** `usuario@rickmorty.app`
* **Clave de Encripción:** `123456`

### B. Vista del Universo (Scroll Infinito y Búsqueda Real)
Una vez dentro, se desplegarán las tarjetas (Cards) con foto, especie y status (Vivo, Muerto, Desconocido).
* A diferencia de sistemas primitivos de paginación o límites en pantalla, al hacer scroll vertical hasta abajo del todo, el **sistema recabará silenciosamente a la siguiente tanda de personajes en segundo plano** gracias a React Intersection Observer.
* Puede usar el motor de búsqueda en tiempo real, conectando sus teclas al instante con el servidor externo usando Debounce.

### C. Añadir personajes Favoritos a la Colección Privada
En la esquina de cada Tarjeta figura un icono de **Estrella Portal**.
* Si el borde de la estrella es color blanco puro, el personaje **no está** guardado como prioritario.
* Para **guardar** este personaje en su propio usuario encriptado, se presiona el icono. El sistema actualizará de Inmediato la memoria local (Optimistic Update) y emitirá un halo/glow de color verde portal fosforescente sobre la estrella marcada.

### D. Quitar personajes de Favoritos
Para **eliminar** un personaje, simplemente debe ubicar una estrella brillante y presionarla de nuevo. Se despintará perdiendo el resplandor tras borrar el registro oficial en la base local con SQLite.

### E. Directorio de Favoritos
En la cabecera superior de la aplicación, al nivel de las estadísticas interdimensionales, presione el botón flotante "**Directorio de Favoritos**" que tiene un contador animado. Navegará a la sub-pestaña `http://localhost:3000/favorites`. 
Esta pestaña consumirá la Base de datos y sólo le presentará personajes protegidos. Si cierra su sesión desde el botón "Desconectar", nadie podrá entrar directo a esta url.

---

## 4. Capturas de pantalla del sistema
*(Nota para la entrega de la evidencia: Se recomienda tomar entre 3 y 4 recortes directos desde la pantalla usando `Win + Shift + S`)*

* **Captura 1:** La pantalla de "Autorización Requerida" (A.K.A Pantalla de Login con los portales borrosos).
* **Captura 2:** La pantalla de Catálogo Principal (`http://localhost:3000`) mostrando el botón Directorio de Favoritos, la caja de búsqueda y algunas tarjetas de personajes.
* **Captura 3:** Una tarjeta con la estrella activada y con brillo neón verde `Box-Shadow`.
* **Captura 4:** La pantalla de "Colección Privada", evidenciando el rediseño sin acceso de invitados y un resumen con las tarjetas previamente seleccionadas.
