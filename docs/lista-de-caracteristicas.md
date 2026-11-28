# Lista de características (FDD)

En esta lista reunimos las funcionalidades que fuimos identificando para VozYControl. Les asignamos un código para poder ubicarlas fácilmente, agrupamos las que tienen un propósito parecido y anotamos quiénes quedaron a cargo según la distribución de nuestros sprints.

También indicamos el estado real de cada característica al revisar el código: así podemos distinguir lo que ya funciona de lo que todavía tenemos pendiente.

**Cómo leemos los estados:**
- **Implementada:** ya podemos encontrar la función en la versión actual.
- **Parcial:** tenemos una parte desarrollada, pero depende de una configuración adicional o no está completa por sí sola.
- **Pendiente:** la contemplamos en la planificación, pero todavía no encontramos su implementación funcional en el código revisado.

| ID | Nombre de la característica | Conjunto | Responsable(s) | Estado |
|---|---|---|---|---|
| F-01 | Mostrar información de servicios | Consulta de servicios | Sebastian Truque y Karol Bermudez | Implementada |
| F-02 | Buscar servicios por texto | Consulta de servicios | Sebastian Truque y Karol Bermudez | Implementada |
| F-03 | Filtrar servicios por categoría | Consulta de servicios | Sebastian Truque y Karol Bermudez | Implementada |
| F-04 | Registrar una cuenta ciudadana | Cuentas y autenticación | Huber Gonzalez y Karol Bermudez | Implementada |
| F-05 | Iniciar sesión con correo y contraseña | Cuentas y autenticación | Huber Gonzalez | Implementada |
| F-06 | Cerrar sesión | Cuentas y autenticación | Huber Gonzalez | Implementada |
| F-07 | Consultar el perfil de la sesión | Cuentas y autenticación | Huber Gonzalez | Implementada |
| F-08 | Iniciar sesión con Google OAuth | Cuentas y autenticación | Huber Gonzalez | Parcial: necesitamos configurar las credenciales externas |
| F-09 | Crear un reporte ciudadano | Gestión de reportes | Huber Gonzalez | Implementada |
| F-10 | Adjuntar evidencia a un reporte | Gestión de reportes | Huber Gonzalez | Implementada |
| F-11 | Consultar los reportes propios | Gestión de reportes | Huber Gonzalez | Implementada |
| F-12 | Consultar todos los reportes como administrador | Administración | Sebastian Truque y Karol Bermudez | Implementada |
| F-13 | Cambiar el estado de un reporte como administrador | Administración | Sebastian Truque y Karol Bermudez | Implementada |
| F-14 | Mostrar resumen de reportes activos y resueltos | Panel de usuario | Huber Gonzalez | Implementada |
| F-15 | Alternar entre tema claro y oscuro | Interfaz y accesibilidad | Equipo BY Defenders | Implementada |
| F-16 | Adaptar la interfaz a distintos tamaños de pantalla | Interfaz y accesibilidad | Equipo BY Defenders | Implementada |
| F-17 | Mostrar preguntas frecuentes dentro de la plataforma | Información de servicios | Huber Gonzalez y Karol Bermudez | Pendiente: no identificamos esta función en la versión revisada |
| F-18 | Filtrar servicios por ubicación geográfica | Consulta de servicios | Sebastian Truque y Karol Bermudez | Pendiente: todavía no encontramos un filtro geográfico funcional |
| F-19 | Notificar al usuario cuando cambia el estado de su reporte | Notificaciones | Sebastian Truque y Karol Bermudez | Pendiente: aún no tenemos un módulo de notificaciones |

## ¿Cómo organizamos esta lista?

Tomamos como referencia la distribución de actividades que definimos por sprints. Cuando una característica aparece asignada a más de una persona, mantenemos esos nombres. La tabla representa la planificación del equipo y no busca atribuir individualmente cada línea de código.

## Relación con FDD

Usamos FDD (Feature-Driven Development) como referencia para organizar el trabajo alrededor de funcionalidades concretas. Esta lista nos sirve para tener claro qué construimos, quiénes participaron y qué nos falta. No significa que hayamos elaborado todos los documentos formales de cada etapa de FDD.
