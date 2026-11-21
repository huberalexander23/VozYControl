# VozYControl

## Plataforma de Defensa y Acceso a Servicios Sociales y Públicos

**VozYControl** es una plataforma web que busca facilitar el acceso de la ciudadanía a información sobre derechos y servicios sociales y públicos. Su propósito es reunir información útil para que las personas puedan conocer los servicios disponibles, identificar sus requisitos y reportar posibles fallas, barreras o negaciones en su prestación.

La iniciativa también busca promover la participación ciudadana, la veeduría y la exigibilidad de derechos, ofreciendo un espacio para documentar situaciones que afectan a la comunidad y contribuir a su seguimiento.

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

## Problemática y justificación

El acceso a los servicios sociales y públicos puede verse limitado por la falta de información clara, la dificultad para conocer los procedimientos y requisitos institucionales y la ausencia de mecanismos sencillos para documentar y hacer seguimiento a las fallas en su prestación.

VozYControl surge como una propuesta tecnológica para acercar la información a la ciudadanía y facilitar el registro de situaciones que puedan afectar el acceso a estos servicios. De esta manera, busca contribuir a una comunidad mejor informada, participativa y con mayores herramientas para ejercer sus derechos.

## Objetivos

### Objetivo general

Desarrollar una plataforma web que facilite el acceso ciudadano a información sobre servicios sociales y públicos y permita documentar situaciones que puedan afectar el ejercicio de los derechos.

### Objetivos específicos

- Democratizar el acceso a la información institucional.
- Facilitar la búsqueda de servicios mediante categorías y ubicación.
- Permitir la consulta de requisitos e información relevante para acceder a los servicios.
- Fortalecer la veeduría y la exigibilidad ciudadana mediante reportes documentados.
- Facilitar la gestión y el seguimiento de los casos registrados.
- Proporcionar herramientas para consultar y administrar la información.

---

## Funcionalidades principales

| Módulo | Descripción |
|---|---|
| Registro de usuarios | Crear cuentas para acceder a las funcionalidades de la plataforma. |
| Buscador por categoría | Encontrar servicios según su área o tipo. |
| Filtro por ubicación | Facilitar la búsqueda de servicios de acuerdo con la ubicación. |
| Información de servicios | Consultar requisitos e información necesaria para acceder a cada servicio. |
| Reportes ciudadanos | Registrar fallas o posibles negaciones de servicios y adjuntar evidencias. |
| Panel administrativo | Consultar y gestionar la información y los reportes recibidos. |
| Notificaciones | Informar sobre novedades relacionadas con los reportes y su seguimiento. |
| Preguntas frecuentes | Resolver dudas comunes sobre el uso de la plataforma y sus servicios. |

## Metodología de desarrollo

El proyecto adopta un enfoque ágil híbrido que combina **Feature-Driven Development (FDD)** con ciclos cortos de trabajo inspirados en Scrum. El desarrollo se organiza alrededor de funcionalidades concretas que se construyen, revisan e integran progresivamente.

El proceso contempla cuatro etapas:

1. **Modelado y definición de la base:** identificación de las entidades principales, como usuarios, servicios públicos y reportes, y definición de sus relaciones.
2. **Diseño de funcionalidades del MVP:** priorización de las funciones esenciales, comenzando por la consulta de servicios, seguida del registro de reportes y el panel administrativo.
3. **Desarrollo por iteraciones:** organización del trabajo en ciclos de aproximadamente dos semanas, con entregas y revisiones periódicas.
4. **Construcción y validación:** desarrollo, prueba e integración progresiva de las funcionalidades.

### Planificación por sprints

| Sprint | Funcionalidades | Responsables | Fecha de entrega propuesta |
|---|---|---|---|
| 1 | Registro de usuarios y sección de preguntas frecuentes | Huber Gonzalez y Karol Bermudez | 17/10/2026 |
| 2 | Buscador por categoría, filtro por ubicación e información de requisitos | Sebastian Truque y Karol Bermudez | 31/10/2026 |
| 3 | Reportes ciudadanos de fallas o negación de servicios con evidencia | Huber Gonzalez | 14/11/2026 |
| 4 | Panel administrativo y sistema de notificaciones | Sebastian Truque y Karol Bermudez | 28/11/2026 |

*Las fechas corresponden a la planificación definida en la propuesta académica.*

---

## Diseño y navegación

La propuesta contempla prototipos de alta y baja fidelidad y un mapa de navegación jerárquico para organizar el recorrido de los usuarios por la plataforma.

La navegación se estructura alrededor de las acciones principales: consultar servicios, revisar información y requisitos, registrar reportes, acceder al perfil y consultar las opciones de administración.

## Tecnologías

La propuesta inicial contemplaba React.js para el frontend y PostgreSQL como sistema de gestión de bases de datos. Durante la implementación técnica, se adaptó la solución a las siguientes tecnologías:

- **Frontend:** HTML5, CSS3 y JavaScript.
- **Backend:** Node.js y Express.
- **Base de datos:** MongoDB Atlas.
- **Modelado de datos:** Mongoose.
- **Gestión de evidencias:** Multer.
- **Seguridad de la aplicación:** Helmet y express-rate-limit.

La base de datos de MongoDB Atlas se denomina `vozycontrol` y permite almacenar la información asociada a los reportes ciudadanos, incluyendo su categoría, ubicación, descripción, estado y evidencia adjunta.

## Accesibilidad y experiencia de usuario

La interfaz incorpora características orientadas a facilitar el uso de la plataforma:

- Navegación mediante teclado.
- Indicadores visibles de foco.
- Contraste adecuado en textos y componentes.
- Diseño adaptable a computadores, tabletas y celulares.
- Preferencia de movimiento reducido.
- Alternancia entre modo claro y modo oscuro.
---

**VozYControl — BY Defenders**  
