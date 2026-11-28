# VozYControl

## ¿Qué es VozYControl?

VozYControl es el proyecto que desarrollamos para que las personas puedan consultar información sobre algunos servicios y reportar situaciones que afectan a su comunidad. Queremos que el proceso sea sencillo: una persona entra a la plataforma, registra lo que está ocurriendo, puede adjuntar una evidencia y después consulta cómo avanza su reporte.

Para organizar el acceso, trabajamos con dos tipos de usuario: **ciudadano** y **administrador**. El ciudadano crea y consulta sus propios reportes; el administrador puede revisar todos los reportes y actualizar su estado.

## Nuestro equipo

**Grupo:** BY Defenders  
**Asignatura:** Programación Orientada a la Web  
**Periodo:** 2026B

| Integrante | Trabajo asignado dentro del proyecto |
|---|---|
| Huber Gonzalez | Registro de usuarios y desarrollo de reportes ciudadanos con evidencia. |
| Sebastian Truque | Buscador y filtros; participación en el panel administrativo. |
| Karol Bermudez | Registro y preguntas frecuentes; participación en el buscador y el panel administrativo. |

Distribuimos estas responsabilidades por etapas de trabajo. En las características compartidas aparecen los integrantes que participaron según la planificación de nuestros sprints.

## ¿Qué hemos desarrollado?

Estas son las funciones que podemos encontrar en la versión actual:

- Una página principal donde presentamos información de servicios.
- Un buscador para encontrar servicios por texto y categoría.
- Registro e inicio de sesión con correo y contraseña.
- Inicio de sesión con Google, siempre que configuremos las credenciales de OAuth.
- Un formulario para crear reportes con categoría, ubicación y descripción.
- La opción de adjuntar una evidencia al reporte.
- Un panel donde cada ciudadano consulta sus reportes y su estado.
- Una vista administrativa desde la que se pueden consultar todos los reportes y cambiar su estado.
- Modo claro y oscuro, además de una interfaz que se adapta a diferentes tamaños de pantalla.

Para los reportes definimos cuatro categorías: `Agua potable`, `Salud`, `Educación` y `Energía`. También manejamos tres estados: `Pendiente`, `En curso` y `Resuelto`.

## Tecnologías que utilizamos

| Parte del proyecto | Tecnología | Para qué la usamos |
|---|---|---|
| Front-end | HTML5, CSS3 y JavaScript | Construimos las páginas, los estilos y las interacciones. |
| Back-end | Node.js y Express 5 | Creamos el servidor y las rutas de nuestra API. |
| Base de datos | MongoDB / MongoDB Atlas | Guardamos la información de usuarios y reportes. |
| Modelado de datos | Mongoose | Definimos los modelos y trabajamos con MongoDB. |
| Autenticación | JWT, bcryptjs y cookies HttpOnly | Protegemos las sesiones y las contraseñas. |
| Inicio con Google | Passport y passport-google-oauth20 | Permitimos el acceso con una cuenta de Google cuando configuramos OAuth. |
| Archivos | Multer | Recibimos y validamos las evidencias adjuntas. |
| Seguridad | Helmet, CORS y express-rate-limit | Añadimos protecciones al servidor y controlamos las solicitudes. |

En nuestro caso, Express también se encarga de servir los archivos del front-end. Por eso no necesitamos levantar un servidor adicional para abrir la página.

## ¿Qué necesitamos para ejecutarlo?

Antes de iniciar, debemos tener instalado:

- Node.js 20 o una versión superior.
- npm.
- Git.
- Una base de datos MongoDB Atlas o una instancia compatible.
- Un navegador actualizado.

## Instalación y ejecución

### 1. Descargar el proyecto

Clonamos el repositorio y entramos en la carpeta:

```bash
git clone https://github.com/huberalexander23/VozYControl.git
cd VozYControl
```

Después instalamos las dependencias:

```bash
npm install
```

### 2. Configurar las variables de entorno

En la carpeta principal creamos un archivo llamado `.env`. Podemos guiarnos por el archivo `.env.example`, pero debemos reemplazar los valores de ejemplo por los nuestros.

| Variable | Para qué la utilizamos |
|---|---|
| `PORT` | Define el puerto del servidor. Si no indicamos uno, usamos el 3000. |
| `MONGODB_URI` | Contiene la dirección de conexión a MongoDB. |
| `MONGODB_DATABASE` | Indica el nombre de la base de datos. Por defecto usamos `vozycontrol`. |
| `JWT_SECRET` | Es el secreto con el que firmamos los tokens. Debe tener al menos 32 caracteres. |
| `APP_URL` | Es la dirección de nuestra aplicación y nos ayuda a validar el origen de las solicitudes. |
| `NODE_ENV` | Nos permite indicar si estamos trabajando en desarrollo o producción. |
| `JWT_EXPIRES_IN` | Define cuánto dura el token. Si no lo configuramos, dura una hora. |

Si queremos habilitar el inicio de sesión con Google, también configuramos:

| Variable | Para qué la utilizamos |
|---|---|
| `GOOGLE_CLIENT_ID` | Identificador de nuestra aplicación en Google Cloud. |
| `GOOGLE_CLIENT_SECRET` | Clave secreta que nos entrega Google. |
| `GOOGLE_CALLBACK_URL` | Dirección a la que Google devuelve al usuario después de autenticarse. |
| `OAUTH_SESSION_SECRET` | Secreto que usamos para la sesión temporal del proceso OAuth. Debe tener al menos 32 caracteres. |

Ejemplo de configuración local:

```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
MONGODB_DATABASE=vozycontrol
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/
JWT_SECRET=<secreto-aleatorio-de-al-menos-32-caracteres>
JWT_EXPIRES_IN=1h
```

Los valores entre marcadores son datos que debemos reemplazar. No debemos subir el archivo `.env` a GitHub ni compartir contraseñas o secretos. Si cambiamos el dominio donde ejecutamos el proyecto, también debemos revisar `APP_URL`, los orígenes permitidos y la dirección de retorno de Google.

### 3. Poner en marcha el proyecto

Para trabajar en desarrollo ejecutamos:

```bash
npm run dev
```

Si queremos iniciarlo de forma normal usamos:

```bash
npm start
```

Luego abrimos [http://localhost:3000](http://localhost:3000). Desde esa dirección podemos entrar al front-end y utilizar la API, porque ambos funcionan desde el mismo servidor Express.

## ¿Cómo probamos los roles?

En el repositorio no dejamos usuarios ni contraseñas de prueba precargados. Para revisar los dos tipos de cuenta, seguimos estos pasos:

1. Iniciamos el proyecto y creamos una cuenta desde el formulario de registro. El sistema le asigna automáticamente el rol `ciudadano`.
2. Entramos con esa cuenta y probamos la creación y consulta de reportes.
3. Para probar el administrador, registramos una segunda cuenta.
4. Desde MongoDB Atlas buscamos esa cuenta en la colección `usuarios` y cambiamos su campo `rol` a `admin`.
5. Cerramos sesión, entramos con la segunda cuenta y probamos la vista administrativa.

Este es un ejemplo del cambio que hacemos en MongoDB Shell; debemos reemplazar el correo por el de nuestra cuenta:

```javascript
db.usuarios.updateOne(
  { email: "admin.prueba@ejemplo.com" },
  { $set: { rol: "admin" } }
)
```

| Rol | Cómo lo conseguimos | Qué podemos probar |
|---|---|---|
| `ciudadano` | Nos registramos desde el formulario. | Crear reportes y consultar únicamente los propios. |
| `admin` | Creamos otra cuenta y cambiamos su rol en MongoDB. | Consultar todos los reportes y actualizar sus estados. |

No publicamos contraseñas de prueba. Para una demostración, creamos cuentas propias y usamos claves que no correspondan a cuentas personales.

## Documentación que preparamos

Para que sea más fácil entender y revisar el proyecto, organizamos la información en estos documentos:

- [Lista de características FDD](docs/lista-de-caracteristicas.md): reunimos las funciones, sus responsables y su estado.
- [Roles y permisos](docs/roles-y-permisos.md): explicamos qué puede hacer cada tipo de usuario.
- [API](docs/api.md): describimos las rutas del servidor y mostramos ejemplos de uso.

## ¿Qué tenemos en cuenta sobre la seguridad?

Durante el desarrollo incorporamos varias medidas para proteger la aplicación:

- Guardamos las contraseñas usando bcrypt, no como texto plano.
- Firmamos los JWT con HS256 y verificamos el token desde el servidor.
- Utilizamos una cookie `HttpOnly` para la autenticación.
- Comprobamos los permisos antes de permitir operaciones administrativas.
- Validamos los datos y las evidencias que se adjuntan. Aceptamos JPG, PNG, WEBP y PDF de hasta 5 MB.
- Configuramos CORS, Helmet y límites para controlar las solicitudes.

## Organización de las carpetas

```text
VozYControl/
├── config/                 # Configuración de Passport y Google OAuth
├── controllers/            # Controladores de autenticación
├── middlewares/            # Verificación de sesión y permisos
├── models/                 # Modelos de usuarios y reportes
├── utils/                  # Funciones auxiliares, como JWT
├── routes/                 # Rutas de autenticación
├── css/                    # Estilos de la interfaz
├── js/                     # Funciones del front-end
├── docs/                   # Documentación del proyecto
├── index.html              # Página principal
├── login.html              # Registro e inicio de sesión
├── panel.html              # Panel de reportes
├── reportar.html            # Formulario para crear reportes
├── perfil.html             # Perfil del usuario
├── server.js               # Servidor Express y API de reportes
└── package.json
```

## Estado actual del proyecto

En la documentación dejamos separado lo que ya funciona de lo que todavía no hemos desarrollado por completo. Por ejemplo, actualmente no contamos con una opción para eliminar reportes ni con un sistema para renovar automáticamente los JWT. Tampoco tenemos usuarios de demostración precargados ni una suite de pruebas automatizadas configurada en el proyecto.

---

**VozYControl — BY Defenders**  
*Este proyecto lo construimos pensando en facilitar la consulta de información y el seguimiento de los reportes ciudadanos.*
