# VozYControl

Plataforma web para consultar información de servicios y registrar problemas que afectan a la comunidad. Los ciudadanos pueden crear reportes, adjuntar evidencias y consultar su estado. Los administradores pueden revisar todos los reportes y actualizar su estado.

## Equipo y responsabilidades

**Grupo:** BY Defenders  
**Asignatura:** Programación Orientada a la Web  
**Periodo:** 2026B

| Integrante | Responsabilidad documentada en el plan de trabajo |
|---|---|
| Huber Gonzalez | Registro de usuarios y desarrollo de reportes ciudadanos con evidencia. |
| Sebastian Truque | Buscador y filtros; participación en el panel administrativo. |
| Karol Bermudez | Registro y preguntas frecuentes; participación en buscador y panel administrativo. |

Las responsabilidades se resumen a partir de la distribución de trabajo por sprints del proyecto.

## Funcionalidades disponibles

- Consulta de servicios informativos desde la página principal.
- Búsqueda por texto y filtros de categoría en el listado de servicios.
- Registro e inicio de sesión con correo y contraseña.
- Inicio de sesión opcional con Google OAuth, si se configuran sus credenciales.
- Creación de reportes con categoría, ubicación, descripción y evidencia opcional.
- Consulta de reportes propios para ciudadanos y de todos los reportes para administradores.
- Actualización del estado de reportes por administradores.
- Tema claro/oscuro y diseño adaptable.

Los estados disponibles son `Pendiente`, `En curso` y `Resuelto`. Las categorías de reporte son `Agua potable`, `Salud`, `Educación` y `Energía`.

## Tecnologías

| Área | Tecnología |
|---|---|
| Front-end | HTML5, CSS3 y JavaScript |
| Back-end / API | Node.js y Express 5 |
| Base de datos | MongoDB / MongoDB Atlas |
| ODM | Mongoose |
| Autenticación | JWT, bcryptjs y cookies HttpOnly |
| OAuth opcional | Passport y passport-google-oauth20 |
| Archivos | Multer |
| Seguridad | Helmet, CORS y express-rate-limit |

El front-end está servido como archivos estáticos por Express. No hay un proceso de compilación ni un servidor de front-end separado.

## Requisitos

- Node.js 20 o superior.
- npm.
- MongoDB Atlas o una instancia compatible de MongoDB.
- Git.
- Un navegador actualizado.

## Instalación y ejecución

### 1. Clonar e instalar

```bash
git clone https://github.com/huberalexander23/VozYControl.git
cd VozYControl
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto. Puedes tomar como referencia `.env.example` y reemplazar los valores de ejemplo por tus propios datos.

Variables requeridas:

| Variable | Uso |
|---|---|
| `PORT` | Puerto del servidor. Por defecto, 3000. |
| `MONGODB_URI` | Cadena de conexión de MongoDB. |
| `MONGODB_DATABASE` | Nombre de la base de datos. Por defecto, `vozycontrol`. |
| `JWT_SECRET` | Secreto para firmar los tokens; mínimo 32 caracteres. |
| `APP_URL` | URL pública de la aplicación; se usa para validar el origen y configurar cookies seguras. |
| `NODE_ENV` | Entorno de ejecución. Usa `development` en local y `production` al desplegar. |
| `JWT_EXPIRES_IN` | Duración del JWT. Por defecto, `1h`. |

Para habilitar Google OAuth también se requieren:

| Variable | Uso |
|---|---|
| `GOOGLE_CLIENT_ID` | Identificador OAuth entregado por Google. |
| `GOOGLE_CLIENT_SECRET` | Secreto OAuth entregado por Google. |
| `GOOGLE_CALLBACK_URL` | URL de retorno configurada en Google Cloud. |
| `OAUTH_SESSION_SECRET` | Secreto de sesión temporal del flujo OAuth; mínimo 32 caracteres cuando OAuth está habilitado. |

Ejemplo local mínimo (sustituye los valores entre marcadores):

```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
MONGODB_DATABASE=vozycontrol
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/
JWT_SECRET=<secreto-aleatorio-de-al-menos-32-caracteres>
JWT_EXPIRES_IN=1h
```

No subas el archivo `.env` ni publiques contraseñas, tokens o secretos. Si despliegas la aplicación en otro dominio, actualiza `APP_URL`, la lista de orígenes permitidos y la URL de retorno de Google.

### 3. Ejecutar

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Abre [http://localhost:3000](http://localhost:3000). Express entrega tanto las páginas del front-end como la API; por eso no se necesita iniciar otro servidor para el front-end.

## Usuarios de prueba por rol

El repositorio no incluye usuarios de prueba ni contraseñas precargadas. Para probar los dos roles:

1. Inicia la aplicación y crea una cuenta desde la pantalla de registro. Toda cuenta nueva recibe automáticamente el rol `ciudadano`.
2. Usa esa cuenta para probar el registro y consulta de reportes de ciudadano.
3. Para probar el rol administrador, crea otra cuenta y cambia su campo `rol` a `admin` directamente en MongoDB Atlas, en la colección `usuarios`. No existe una pantalla pública para asignar privilegios.
4. Inicia sesión con esa segunda cuenta para probar la consulta global y el cambio de estado de reportes.

Ejemplo de documento a actualizar en MongoDB (reemplaza el correo por el de la cuenta creada):

```javascript
db.usuarios.updateOne(
  { email: "admin.prueba@ejemplo.com" },
  { $set: { rol: "admin" } }
)
```

| Rol | Usuario de prueba | Cómo obtenerlo |
|---|---|---|
| `ciudadano` | Cuenta creada desde el formulario de registro. | El registro asigna este rol automáticamente. |
| `admin` | Segunda cuenta creada para pruebas. | Un responsable debe cambiar su campo `rol` a `admin` en MongoDB. |

No hay contraseñas de prueba publicadas en el repositorio. Define las contraseñas al crear las cuentas y no uses credenciales reales en demostraciones.

## Documentación del proyecto

- [Lista de características FDD](docs/lista-de-caracteristicas.md)
- [Roles y permisos](docs/roles-y-permisos.md)
- [Documentación de la API](docs/api.md)

## Seguridad implementada

- Contraseñas almacenadas con bcrypt.
- JWT firmado con HS256 y validado en el servidor.
- Cookie de autenticación `HttpOnly`, `SameSite=Lax` y `Secure` cuando corresponde.
- Verificación de identidad y permisos en el back-end.
- Validación de datos y archivos adjuntos; se aceptan JPG, PNG, WEBP y PDF de hasta 5 MB.
- CORS con orígenes permitidos, protección de origen en solicitudes autenticadas que modifican datos, Helmet y limitación de solicitudes.

## Estructura principal

```text
VozYControl/
├── config/                 # Configuración de Passport / Google OAuth
├── controllers/            # Controladores de autenticación
├── middlewares/            # Autenticación y autorización
├── models/                 # Modelos Usuario y Reporte
├── utils/                  # Utilidades JWT
├── routes/                 # Rutas de autenticación
├── css/                    # Estilos
├── js/                     # Lógica del front-end
├── docs/                   # Documentación funcional y técnica
├── index.html              # Página principal
├── login.html              # Registro e inicio de sesión
├── panel.html              # Panel de reportes
├── reportar.html           # Formulario de reportes
├── perfil.html             # Perfil
├── server.js               # Servidor Express y API de reportes
└── package.json
```

## Alcance actual

La lista FDD y la documentación de API indican qué está implementado y qué queda parcial o pendiente. Por ejemplo, el código actual no expone una operación para eliminar reportes ni incluye un mecanismo de renovación de JWT. Tampoco se incluyen usuarios de demostración ni una suite de pruebas automatizadas configurada en `package.json`.

---

**VozYControl — BY Defenders**
