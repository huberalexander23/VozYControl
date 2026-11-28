# Roles y permisos

VozYControl maneja dos roles almacenados en el campo `rol` del usuario: `ciudadano` y `admin`. La autorización se aplica en el servidor mediante el middleware de autenticación y, para la operación administrativa, el middleware `permitirRoles("admin")`.

## Matriz de permisos

| Operación | Público (sin sesión) | Ciudadano | Administrador |
|---|---:|---:|---:|
| Consultar páginas públicas de servicios | Sí | Sí | Sí |
| Buscar servicios por texto y categoría en la interfaz | Sí | Sí | Sí |
| Registrarse | Sí | No aplica | No aplica |
| Iniciar sesión / Google OAuth | Sí | Sí | Sí |
| Consultar perfil autenticado | No | Sí, propio | Sí, propio |
| Cerrar sesión | Sí (limpia la cookie si existe) | Sí | Sí |
| Crear un reporte | No | Sí | Sí |
| Consultar reportes propios | No | Sí | Sí |
| Consultar reportes de otros usuarios | No | No | Sí (todos) |
| Cambiar el estado de un reporte | No | No | Sí |
| Asignar o cambiar roles desde la aplicación | No | No | No |

## Reglas importantes

- El registro normal siempre crea usuarios con rol `ciudadano`; el cliente no puede elegir `admin` enviando un campo en la petición.
- La API obtiene el usuario asociado al JWT y vuelve a consultar su cuenta en MongoDB.
- En `GET /api/reportes`, un ciudadano recibe únicamente sus reportes; un administrador recibe todos.
- `PATCH /api/reportes/:id/estado` exige sesión válida y rol `admin`. Un usuario sin sesión recibe `401`; un ciudadano autenticado recibe `403`.
- La interfaz puede ocultar controles según el rol, pero esa presentación no reemplaza la autorización del servidor.
- Para preparar una cuenta administradora de prueba, se debe modificar manualmente el campo `rol` de esa cuenta en MongoDB. No existe una ruta pública para promover usuarios.

## Referencia de implementación

- `models/Usuario.js`: define los roles permitidos y el rol predeterminado.
- `middlewares/auth.middleware.js`: verifica JWT y comprueba roles.
- `server.js`: aplica autenticación y autorización a las operaciones de reportes.
- `controllers/auth.controller.js`: el registro fuerza el rol `ciudadano`.
