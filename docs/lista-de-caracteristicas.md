# Lista de características (FDD)

Esta lista refleja las funcionalidades observables en el código actual. Se usa la identificación `F-` para poder referenciar cada característica durante el diseño, desarrollo y revisión.

**Estados:** Implementada = disponible en el código; Parcial = existe una parte funcional, pero no está completa como función integral; Pendiente = no se encontró implementada en la versión revisada.

| ID | Nombre de la característica | Conjunto (feature set) | Responsable | Estado |
|---|---|---|---|---|
| F-01 | Mostrar información de servicios | Consulta de servicios | Sebastian Truque y Karol Bermudez | Implementada |
| F-02 | Buscar servicios por texto | Consulta de servicios | Sebastian Truque y Karol Bermudez | Implementada |
| F-03 | Filtrar servicios por categoría | Consulta de servicios | Sebastian Truque y Karol Bermudez | Implementada |
| F-04 | Registrar una cuenta ciudadana | Cuentas y autenticación | Huber Gonzalez y Karol Bermudez | Implementada |
| F-05 | Iniciar sesión con correo y contraseña | Cuentas y autenticación | Huber Gonzalez | Implementada |
| F-06 | Cerrar sesión | Cuentas y autenticación | Huber Gonzalez | Implementada |
| F-07 | Consultar el perfil de la sesión | Cuentas y autenticación | Huber Gonzalez | Implementada |
| F-08 | Iniciar sesión con Google OAuth | Cuentas y autenticación | Huber Gonzalez | Parcial (depende de credenciales y configuración externa) |
| F-09 | Crear un reporte ciudadano | Gestión de reportes | Huber Gonzalez | Implementada |
| F-10 | Adjuntar evidencia a un reporte | Gestión de reportes | Huber Gonzalez | Implementada |
| F-11 | Consultar los reportes propios | Gestión de reportes | Huber Gonzalez | Implementada |
| F-12 | Consultar todos los reportes como administrador | Administración | Sebastian Truque y Karol Bermudez | Implementada |
| F-13 | Cambiar el estado de un reporte como administrador | Administración | Sebastian Truque y Karol Bermudez | Implementada |
| F-14 | Mostrar resumen de reportes activos y resueltos | Panel de usuario | Huber Gonzalez | Implementada |
| F-15 | Alternar entre tema claro y oscuro | Interfaz y accesibilidad | Equipo BY Defenders | Implementada |
| F-16 | Adaptar la interfaz a distintos tamaños de pantalla | Interfaz y accesibilidad | Equipo BY Defenders | Implementada |
| F-17 | Preguntas frecuentes dentro de la plataforma | Información de servicios | Huber Gonzalez y Karol Bermudez | Pendiente / no identificada en la versión revisada |
| F-18 | Filtrar servicios por ubicación geográfica | Consulta de servicios | Sebastian Truque y Karol Bermudez | Pendiente / no identificado como filtro funcional |
| F-19 | Notificar al usuario los cambios de estado | Notificaciones | Sebastian Truque y Karol Bermudez | Pendiente / no se encontró un módulo de notificaciones |

## Criterio de asignación

Los responsables se basan en la distribución de trabajo por sprints que figura en el plan académico del proyecto. Cuando el plan asigna una funcionalidad a más de una persona, se conservan esos nombres; la tabla no pretende certificar autoría individual de cada línea de código.

## Nota sobre FDD

FDD (Feature-Driven Development) organiza el trabajo alrededor de funcionalidades pequeñas y verificables. Esta tabla documenta el inventario y estado de las características del proyecto; no afirma que se hayan generado todos los artefactos formales de cada fase de FDD.
