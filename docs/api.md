# API de VozYControl

En este documento explicamos cómo se comunica nuestro front-end con el servidor. Aquí dejamos las rutas que tenemos disponibles, qué necesita cada una para funcionar y ejemplos para probarlas desde Postman o cURL.

Nuestra API funciona en el mismo servidor Express que entrega las páginas del sitio. Cuando trabajamos localmente, usamos como dirección base `http://localhost:3000`.

## Antes de probar: autenticación

Para proteger las operaciones privadas usamos un JWT. Normalmente, el navegador lo envía en la cookie `vozy_token`, que configuramos como HttpOnly. También aceptamos el token en la cabecera `Authorization: Bearer <token>`.

En nuestra aplicación web usamos la cookie y enviamos las peticiones con `credentials: "same-origin"`.

Manejamos dos roles:
- `ciudadano`
- `admin`

## Rutas disponibles

| Método | Ruta | ¿Necesita autenticación? | Roles permitidos | ¿Para qué la usamos? |
|---|---|---|---|---|
| GET | `/api/health` | No | Público | Revisamos que el servidor responda y consultamos el nombre de la base de datos conectada. |
| POST | `/api/auth/registro` | No | Público | Creamos una cuenta ciudadana y dejamos iniciada su sesión. |
| POST | `/api/auth/login` | No | Público | Permitimos entrar con correo y contraseña. |
| GET | `/api/auth/perfil` | Sí | Ciudadano, admin | Consultamos los datos del usuario que inició sesión. |
| POST | `/api/auth/logout` | No obligatoria | Público / sesión actual | Cerramos la sesión limpiando la cookie de autenticación. |
| GET | `/api/auth/google` | No | Público, si configuramos OAuth | Comenzamos el inicio de sesión con Google. |
| GET | `/api/auth/google/callback` | Flujo OAuth | Usuario autenticado por Google | Recibimos la respuesta de Google, creamos la sesión y redirigimos al panel. |
| GET | `/api/reportes` | Sí | Ciudadano, admin | Mostramos los reportes propios o todos, dependiendo del rol. |
| POST | `/api/reportes` | Sí | Ciudadano, admin | Guardamos un nuevo reporte y, si se adjunta, su evidencia. |
| PATCH | `/api/reportes/:id/estado` | Sí | Solo admin | Actualizamos el estado de un reporte. |

Por ahora no hemos creado rutas para eliminar reportes, administrar usuarios ni cambiar roles desde la aplicación.

## Ejemplos para probar la API

Los ejemplos usan `http://localhost:3000`. Los identificadores y datos que aparecen son de muestra; al probar en nuestra base de datos debemos usar los valores que nos devuelva el servidor.

### 1. Registrar una cuenta ciudadana

**Petición**

```http
POST /api/auth/registro
Content-Type: application/json
```

```json
{
  "nombre": "Usuario Prueba",
  "email": "ciudadano.prueba@ejemplo.com",
  "password": "ClaveSegura123"
}
```

**Respuesta esperada (201)**

```json
{
  "message": "Cuenta creada correctamente.",
  "usuario": {
    "id": "665f00000000000000000001",
    "nombre": "Usuario Prueba",
    "email": "ciudadano.prueba@ejemplo.com",
    "rol": "ciudadano"
  }
}
```

Además de devolver los datos públicos de la cuenta, el servidor establece la cookie `vozy_token`. El registro siempre asigna el rol `ciudadano`.

### 2. Iniciar sesión

**Petición**

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "ciudadano.prueba@ejemplo.com",
  "password": "ClaveSegura123"
}
```

**Respuesta esperada (200)**

```json
{
  "message": "Inicio de sesión correcto.",
  "usuario": {
    "id": "665f00000000000000000001",
    "nombre": "Usuario Prueba",
    "email": "ciudadano.prueba@ejemplo.com",
    "rol": "ciudadano"
  }
}
```

Cuando iniciamos sesión correctamente, el servidor también envía la cookie de autenticación.

### 3. Consultar el perfil

**Petición**

```http
GET /api/auth/perfil
Cookie: vozy_token=<token>
```

**Respuesta esperada (200)**

```json
{
  "usuario": {
    "id": "665f00000000000000000001",
    "nombre": "Usuario Prueba",
    "email": "ciudadano.prueba@ejemplo.com",
    "rol": "ciudadano"
  }
}
```

Con esta ruta consultamos quién inició sesión y qué rol tiene.

### 4. Consultar reportes

**Petición**

```http
GET /api/reportes
Cookie: vozy_token=<token>
```

**Respuesta de ejemplo (200)**

```json
{
  "reports": [
    {
      "_id": "665f00000000000000000002",
      "usuario": "665f00000000000000000001",
      "category": "Agua potable",
      "location": "Barrio de prueba",
      "description": "Interrupción del servicio de agua en el sector.",
      "reporterName": "Usuario Prueba",
      "status": "Pendiente",
      "evidence": null,
      "createdAt": "2026-11-28T10:00:00.000Z",
      "updatedAt": "2026-11-28T10:00:00.000Z"
    }
  ]
}
```

La respuesta depende del rol con el que entramos: si usamos una cuenta ciudadana, recibimos sus propios reportes; si usamos una cuenta administradora, recibimos todos.

### 5. Crear un reporte

Para crear un reporte enviamos los campos como `multipart/form-data`. La evidencia es opcional. Si adjuntamos un archivo, aceptamos JPG, PNG, WEBP o PDF de máximo 5 MB.

**Petición con cURL**

```bash
curl -X POST http://localhost:3000/api/reportes \
  -H "Cookie: vozy_token=<token>" \
  -F "categoria=Agua potable" \
  -F "ubicacion=Barrio de prueba" \
  -F "descripcion=Interrupción del servicio de agua en el sector." \
  -F "evidencia=@./evidencia.jpg"
```

**Respuesta esperada (201)**

```json
{
  "message": "Reporte guardado correctamente.",
  "report": {
    "_id": "665f00000000000000000003",
    "category": "Agua potable",
    "location": "Barrio de prueba",
    "description": "Interrupción del servicio de agua en el sector.",
    "reporterName": "Usuario Prueba",
    "status": "Pendiente",
    "evidence": {
      "filename": "evidencia.jpg",
      "mimetype": "image/jpeg",
      "size": 24576
    },
    "createdAt": "2026-11-28T10:00:00.000Z"
  }
}
```

Si no adjuntamos un archivo, el reporte se guarda con `evidence: null`. Al crearlo, su estado inicial es `Pendiente`.

### 6. Actualizar el estado de un reporte (solo administrador)

Esta operación está reservada para el rol `admin`. En el ejemplo cambiamos el estado a `En curso`.

**Petición**

```http
PATCH /api/reportes/665f00000000000000000003/estado
Content-Type: application/json
Cookie: vozy_token=<token>
```

```json
{
  "status": "En curso"
}
```

**Respuesta esperada (200)**

```json
{
  "message": "Estado actualizado.",
  "report": {
    "_id": "665f00000000000000000003",
    "category": "Agua potable",
    "location": "Barrio de prueba",
    "description": "Interrupción del servicio de agua en el sector.",
    "reporterName": "Usuario Prueba",
    "status": "En curso"
  }
}
```

Los únicos estados que aceptamos son `Pendiente`, `En curso` y `Resuelto`. Si intentamos cambiarlo con una cuenta ciudadana, el servidor rechaza la operación.

### 7. Cerrar sesión

**Petición**

```http
POST /api/auth/logout
```

**Respuesta esperada (200)**

```json
{
  "message": "Sesión cerrada."
}
```

Con esta operación limpiamos la cookie `vozy_token` del navegador.

### 8. Comprobar que el servidor está disponible

**Petición**

```http
GET /api/health
```

**Respuesta esperada (200)**

```json
{
  "status": "ok",
  "database": "vozycontrol"
}
```

Usamos esta ruta para comprobar que el servidor responde y que tenemos una conexión activa con la base de datos.

## Respuestas y errores que podemos encontrar

| Código | Qué significa |
|---|---|
| 200 | La operación se completó correctamente. |
| 201 | Creamos un usuario o un reporte. |
| 400 | Algún dato no es válido, el estado o categoría no está permitido, el archivo no cumple los requisitos o el identificador está mal formado. |
| 401 | Falta iniciar sesión, el token no es válido o las credenciales son incorrectas. |
| 403 | La cuenta no tiene permiso para esa operación o el origen de la solicitud no está permitido. |
| 404 | No encontramos el reporte solicitado. |
| 409 | El correo ya está registrado. |
| 503 | Intentamos usar Google OAuth, pero todavía no está configurado. |
| 500 | Ocurrió un error interno del servidor. |

También aplicamos límites a las solicitudes: para el registro y el inicio de sesión permitimos hasta 8 intentos en un periodo de 15 minutos. La API cuenta además con un límite general de solicitudes.

## Recomendaciones para hacer las pruebas

- Primero registramos una cuenta ciudadana desde `POST /api/auth/registro`.
- Para probar las funciones de administración, creamos otra cuenta y cambiamos su campo `rol` a `admin` directamente en MongoDB.
- En Postman podemos conservar la cookie que recibimos al iniciar sesión o enviar el JWT en la cabecera Bearer.
- Cuando creamos un reporte, seleccionamos `form-data` como tipo de cuerpo. Si adjuntamos evidencia, la agregamos como archivo y no como texto JSON.
