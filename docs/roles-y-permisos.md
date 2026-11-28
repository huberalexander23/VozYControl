# Roles y permisos

En VozYControl organizamos el acceso en dos roles: **ciudadano** y **administrador**. Lo hicimos así porque no todos los usuarios necesitan las mismas opciones: una persona puede registrar y consultar sus reportes, mientras que quien administra la plataforma necesita revisar los casos de toda la comunidad y actualizar sus estados.

Esta separación no depende solamente de lo que mostramos en pantalla. También la verificamos desde el servidor para evitar que alguien realice una acción para la que no tiene permiso.

## Matriz de permisos

| Operación | Público (sin iniciar sesión) | Ciudadano | Administrador |
|---|---:|---:|---:|
| Consultar las páginas públicas de servicios | Sí | Sí | Sí |
| Buscar servicios por texto y categoría | Sí | Sí | Sí |
| Registrarse | Sí | No aplica | No aplica |
| Iniciar sesión con correo o Google | Sí | Sí | Sí |
| Consultar el perfil de la sesión | No | Sí, su propio perfil | Sí, su propio perfil |
| Cerrar sesión | Sí, si existe una cookie | Sí | Sí |
| Crear un reporte | No | Sí | Sí |
| Consultar sus propios reportes | No | Sí | Sí |
| Consultar reportes de otros usuarios | No | No | Sí, puede consultar todos |
| Cambiar el estado de un reporte | No | No | Sí |
| Asignar o cambiar roles desde la aplicación | No | No | No |

## ¿Cómo aplicamos estos permisos?

- Cuando una persona se registra, le asignamos automáticamente el rol `ciudadano`. No permitimos que alguien se convierta en administrador enviando otro rol desde el formulario.
- Cuando llega una petición privada, verificamos el JWT y consultamos en MongoDB a qué usuario pertenece.
- Si un ciudadano consulta `GET /api/reportes`, le devolvemos únicamente los reportes que creó.
- Si quien consulta es administrador, le permitimos ver todos los reportes.
- Para cambiar el estado mediante `PATCH /api/reportes/:id/estado`, exigimos que la persona tenga una sesión válida y el rol `admin`.
- Si alguien no ha iniciado sesión, respondemos con `401`. Si inició sesión como ciudadano e intenta realizar una acción administrativa, respondemos con `403`.

Aunque en la interfaz ocultamos las opciones que no corresponden a cada rol, también comprobamos los permisos en el back-end. De esa forma, no dependemos únicamente de lo que el usuario ve en pantalla.

## ¿Cómo preparamos una cuenta administradora para las pruebas?

Como no creamos una pantalla para asignar roles, registramos una segunda cuenta y cambiamos su campo `rol` directamente en MongoDB. Lo hacemos desde la colección `usuarios`, modificando el valor a `admin`.

## ¿Dónde está programada esta lógica?

- `models/Usuario.js`: definimos los roles permitidos y dejamos `ciudadano` como valor predeterminado.
- `middlewares/auth.middleware.js`: verificamos el token y comprobamos los roles autorizados.
- `server.js`: protegemos las operaciones de consulta y actualización de reportes.
- `controllers/auth.controller.js`: nos aseguramos de que el registro normal cree cuentas ciudadanas.
