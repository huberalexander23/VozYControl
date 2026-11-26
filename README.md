# VozYControl

## Una herramienta para informar, reportar y hacer seguimiento

**VozYControl** nace con una idea sencilla: que las personas puedan encontrar información sobre los servicios públicos y tengan un lugar donde contar los problemas que se presentan con ellos. Desde la plataforma se pueden consultar servicios, crear reportes, adjuntar evidencias y revisar cómo avanza cada caso.

También cuenta con dos tipos de usuario: ciudadanos, que registran y consultan sus reportes, y administradores, que pueden revisar todos los casos y actualizar su estado.

---

## Información académica

| Dato | Información |
|---|---|
| Proyecto | VozYControl |
| Grupo | BY Defenders |
| Asignatura | Programación Orientada a la Web |
| Periodo académico | 2026B |
| Tipo de proyecto | Aplicación web |

### Integrantes

- **Huber Gonzalez**
- **Sebastian Truque**
- **Karol Bermudez**

---

## ¿Por qué hicimos VozYControl?

A veces no es fácil encontrar información clara sobre un servicio, saber dónde acudir o dejar constancia de un problema. Por eso pensamos en VozYControl: una plataforma que reúne información básica de servicios y permite registrar situaciones que afectan a la comunidad, para que cada reporte quede documentado y se pueda consultar su estado.

## ¿Qué se puede hacer en la plataforma?

### Consulta de servicios

- Página principal con tarjetas informativas de servicios.
- Búsqueda de servicios por texto.
- Filtros por categoría: Todos, Salud, Agua, Educación y Energía.
- Acceso a información descriptiva de cada servicio.

### Registro y autenticación

- Creación de cuentas con nombre, correo y contraseña.
- Inicio y cierre de sesión.
- Contraseñas almacenadas mediante hash con bcrypt.
- Autenticación basada en JSON Web Tokens (JWT).
- Token de sesión almacenado en una cookie protegida `HttpOnly`.
- Inicio de sesión con Google mediante Passport y OAuth 2.0, cuando se configuran las credenciales correspondientes.

### Reportes ciudadanos

- Creación de reportes asociados al usuario autenticado.
- Selección de categoría, ubicación y descripción.
- Adjuntar una evidencia opcional en formato JPG, PNG, WEBP o PDF.
- Límite de tamaño de archivo de 5 MB.
- Almacenamiento de los reportes en MongoDB Atlas.
- Consulta de los reportes propios y visualización de su estado.

### Panel y administración

- Panel personal con resumen de reportes activos y resueltos.
- Los ciudadanos solo pueden consultar sus propios reportes.
- Los administradores pueden consultar todos los reportes.
- Los administradores pueden cambiar el estado de un reporte entre **Pendiente**, **En curso** y **Resuelto**.
- La API verifica el rol del usuario en el servidor antes de permitir cambios de estado; ocultar controles en la interfaz no sustituye esta validación.

### Navegación y experiencia de usuario

- Navegación entre Inicio, Buscar, Reportar y Perfil.
- La navegación pública consulta la sesión activa para ofrecer acceso al panel sin pedir un nuevo inicio de sesión innecesario.
- Alternancia entre modo claro y modo oscuro.
- Diseño adaptable a distintos tamaños de pantalla.
- Etiquetas y controles accesibles, mensajes de validación y navegación mediante teclado.

---

## Tipos de usuario y permisos

VozYControl cuenta con dos roles:

| Rol | Permisos |
|---|---|
| `ciudadano` | Crear reportes y consultar únicamente los reportes asociados a su cuenta. |
| `admin` | Consultar todos los reportes y actualizar el estado de cualquiera de ellos. |

Cuando alguien se registra, su cuenta queda con el rol `ciudadano`. El rol `admin` se asigna desde MongoDB Atlas a las cuentas autorizadas. Los permisos se revisan desde el servidor, así que un ciudadano no puede cambiar el estado de un reporte por su cuenta.

---

## Herramientas y tecnologías

| Área | Tecnología | Uso |
|---|---|---|
| Frontend | HTML5 | Estructura de las páginas. |
| Estilos | CSS3 | Diseño adaptable, componentes y temas visuales. |
| Interactividad | JavaScript | Búsqueda, filtros, formularios, sesión y paneles. |
| Backend | Node.js y Express | Servidor y API REST. |
| Base de datos | MongoDB Atlas | Persistencia de usuarios y reportes. |
| Modelado | Mongoose | Esquemas y consultas a MongoDB. |
| Autenticación | JSON Web Token (JWT) | Identificación de usuarios mediante token. |
| Contraseñas | bcryptjs | Hash y verificación de contraseñas. |
| OAuth | Passport y passport-google-oauth20 | Inicio de sesión opcional con Google. |
| Archivos | Multer | Recepción y validación de evidencias. |
| Seguridad | Helmet, CORS y express-rate-limit | Cabeceras HTTP, control de orígenes y limitación de solicitudes. |
| Cookies y sesión OAuth | cookie-parser y express-session | Lectura de cookies y estado temporal del flujo OAuth. |

---

## Rutas principales de la API

Estas son las rutas que utiliza la aplicación para gestionar usuarios y reportes:

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/api/auth/registro` | Registrar una cuenta nueva. | Público |
| `POST` | `/api/auth/login` | Iniciar sesión con correo y contraseña. | Público |
| `GET` | `/api/auth/perfil` | Consultar el perfil de la sesión actual. | Autenticado |
| `POST` | `/api/auth/logout` | Cerrar la sesión. | Público / sesión actual |
| `GET` | `/api/auth/google` | Iniciar autenticación con Google. | Público, si OAuth está configurado |
| `GET` | `/api/auth/google/callback` | Recibir la respuesta de Google. | Flujo OAuth |
| `GET` | `/api/reportes` | Consultar reportes propios o todos, según el rol. | Autenticado |
| `POST` | `/api/reportes` | Crear un reporte y adjuntar evidencia opcional. | Autenticado |
| `PATCH` | `/api/reportes/:id/estado` | Actualizar el estado de un reporte. | Solo administrador |
| `GET` | `/api/health` | Comprobar el estado del servidor y la conexión a la base de datos. | Público |

Los estados permitidos para un reporte son `Pendiente`, `En curso` y `Resuelto`.

---

## ¿Cómo está organizado el proyecto?

```text
VozYControl/
├── config/
│   └── passport.js
├── controllers/
│   └── auth.controller.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   ├── Usuario.js
│   └── Reporte.js
├── routes/
│   └── auth.routes.js
├── utils/
│   └── jwt.js
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── index.html
├── login.html
├── panel.html
├── perfil.html
├── reportar.html
├── server.js
├── package.json
└── README.md
```

---

## Cómo ejecutar el proyecto

### Requisitos

- Node.js 20 o superior.
- npm.
- Una instancia de MongoDB Atlas o una instancia compatible de MongoDB.
- Git.

### 1. Clonar el repositorio

```bash
git clone https://github.com/huberalexander23/VozYControl.git
cd VozYControl
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo llamado `.env` en la carpeta principal del proyecto y agrega la configuración básica:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/
MONGODB_DATABASE=vozycontrol
JWT_SECRET=<secreto_aleatorio_de_al_menos_32_caracteres>
APP_URL=http://localhost:3000
```

Para habilitar el inicio de sesión con Google, configurar también:

```env
GOOGLE_CLIENT_ID=<client_id_de_google>
GOOGLE_CLIENT_SECRET=<client_secret_de_google>
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
OAUTH_SESSION_SECRET=<secreto_aleatorio_de_al_menos_32_caracteres>
```

Guarda tus claves y contraseñas únicamente en el archivo local `.env`. No las publiques ni las subas a GitHub. Si vas a desplegar la aplicación en otro dominio, actualiza las URL y la configuración de Google Cloud.

### 4. Iniciar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Abrir en el navegador:

```text
http://localhost:3000
```

---

## Seguridad

- Contraseñas protegidas mediante bcrypt.
- JWT firmado y validado en el servidor.
- Cookie de autenticación configurada con `HttpOnly`, `SameSite=Lax` y `Secure` cuando corresponde a HTTPS.
- Middleware de autenticación para proteger las operaciones privadas.
- Middleware de autorización por roles para restringir la actualización de estados al administrador.
- Validación de categorías, ubicación, descripción y archivos adjuntos.
- Límite de tamaño y tipos MIME permitidos para evidencias.
- Configuración de CORS y validación del origen para solicitudes que modifican datos con sesión autenticada.
- Limitación de solicitudes a la API y cabeceras de seguridad mediante Helmet.

---

## Cómo organizamos el desarrollo

Fuimos organizando el trabajo por funcionalidades, avanzando por etapas y revisando cada parte a medida que se iba construyendo. Primero definimos la idea y las funciones principales; después trabajamos en el desarrollo, la integración y las pruebas.

### Plan de trabajo

| Sprint | Trabajo del sprint | Responsables | Fecha |
|---|---|---|---|
| 1 | Registro de usuarios y sección de preguntas frecuentes | Huber Gonzalez y Karol Bermudez | 17/10/2026 |
| 2 | Buscador por categoría, filtro por ubicación e información de requisitos | Sebastian Truque y Karol Bermudez | 31/10/2026 |
| 3 | Reportes ciudadanos de fallas o negación de servicios con evidencia | Huber Gonzalez | 14/11/2026 |
| 4 | Panel administrativo y sistema de notificaciones | Sebastian Truque y Karol Bermudez | 28/11/2026 |

---

**VozYControl — BY Defenders**  
*Una plataforma para consultar servicios, registrar problemas y seguir sus avances.*
