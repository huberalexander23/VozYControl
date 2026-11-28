# API de VozYControl

La API se ejecuta en el mismo servidor Express que entrega el front-end. En desarrollo, la URL base es `http://localhost:3000`.

## Autenticación

Las rutas privadas aceptan el JWT enviado en la cookie `vozy_token` (configurada como HttpOnly) o en la cabecera `Authorization: Bearer <token>`. Para peticiones desde el navegador, la aplicación usa la cookie y `credentials: "same-origin"`.

Roles disponibles: `ciudadano` y `admin`.

## Endpoints

| Método | Ruta | Autenticación | Roles permitidos | Descripción |
|---|---|---|---|---|
| GET | `/api/health` | No | Público | Comprueba el estado del servidor y muestra el nombre de la conexión de base de datos. |
| POST | `/api/auth/registro` | No | Público | Crea una cuenta con rol ciudadano e inicia sesión. |
| POST | `/api/auth/login` | No | Público | Inicia sesión con correo y contraseña. |
| GET | `/api/auth/perfil` | Sí | Ciudadano, admin | Devuelve los datos públicos del usuario autenticado. |
| POST | `/api/auth/logout` | No obligatoria | Público / sesión actual | Elimina la cookie de autenticación. |
| GET | `/api/auth/google` | No | Público, si OAuth está configurado | Inicia el flujo de autenticación con Google. |
| GET | `/api/auth/google/callback` | Flujo OAuth | Usuario autenticado por Google | Recibe la respuesta de Google, establece la cookie y redirige al panel. |
| GET | `/api/reportes` | Sí | Ciudadano, admin | Ciudadano recibe sus reportes; admin recibe todos. |
| POST | `/api/reportes` | Sí | Ciudadano, admin | Crea un reporte; acepta evidencia opcional multipart/form-data. |
| PATCH | `/api/reportes/:id/estado` | Sí | Solo admin | Cambia el estado de un reporte existente. |

No existe actualmente un endpoint para eliminar reportes ni para administrar usuarios o asignar roles.

## Ejemplos de petición y respuesta

Los ejemplos usan `http://localhost:3000`. Los identificadores y datos son ilustrativos.

### 1. Registrar ciudadano

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

**Respuesta (201)**

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

La respuesta también establece la cookie `vozy_token`.

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

**Respuesta (200)**

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

### 3. Consultar perfil

**Petición**

```http
GET /api/auth/perfil
Cookie: vozy_token=<token>
```

**Respuesta (200)**

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

### 4. Consultar reportes

**Petición**

```http
GET /api/reportes
Cookie: vozy_token=<token>
```

**Respuesta (200)**

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

Un ciudadano solo recibe documentos asociados a su cuenta. Un administrador recibe el conjunto de reportes.

### 5. Crear reporte

El endpoint espera `multipart/form-data`. La evidencia es opcional y debe ser JPG, PNG, WEBP o PDF, con máximo 5 MB.

**Petición con cURL**

```bash
curl -X POST http://localhost:3000/api/reportes \
  -H "Cookie: vozy_token=<token>" \
  -F "categoria=Agua potable" \
  -F "ubicacion=Barrio de prueba" \
  -F "descripcion=Interrupción del servicio de agua en el sector." \
  -F "evidencia=@./evidencia.jpg"
```

**Respuesta (201)**

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

### 6. Actualizar estado (solo admin)

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

**Respuesta (200)**

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

Los estados admitidos son `Pendiente`, `En curso` y `Resuelto`.

### 7. Cerrar sesión

**Petición**

```http
POST /api/auth/logout
```

**Respuesta (200)**

```json
{
  "message": "Sesión cerrada."
}
```

El servidor envía una instrucción para limpiar la cookie `vozy_token`.

### 8. Comprobar disponibilidad

**Petición**

```http
GET /api/health
```

**Respuesta (200)**

```json
{
  "status": "ok",
  "database": "vozycontrol"
}
```

## Validaciones y códigos de respuesta

| Código | Significado / casos habituales |
|---|---|
| 200 | Operación correcta. |
| 201 | Registro de usuario o reporte creado. |
| 400 | Datos inválidos, categoría o estado no permitido, archivo no válido, archivo mayor de 5 MB o identificador mal formado. |
| 401 | No hay sesión válida, el token expiró o las credenciales no son correctas. |
| 403 | El usuario no tiene el rol requerido o el origen de una petición autenticada no está permitido. |
| 404 | No se encontró el reporte solicitado. |
| 409 | El correo ya está registrado. |
| 503 | Google OAuth no está configurado y se intenta iniciar ese flujo. |
| 500 | Error interno no controlado. |

El registro y el inicio de sesión tienen un límite de 8 intentos por 15 minutos. La API también aplica un límite general de solicitudes.

## Notas para probar

- Registra primero un ciudadano desde `POST /api/auth/registro`.
- Para probar operaciones de administrador, crea otra cuenta y cambia su campo `rol` a `admin` directamente en MongoDB.
- En Postman, conserva la cookie que devuelve el login o envía el JWT como Bearer token.
- Para el endpoint de reportes, selecciona el tipo de cuerpo `form-data`; no envíes el archivo como JSON.
