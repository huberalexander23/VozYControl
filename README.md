# VozYControl

## Plataforma de Defensa y Acceso a Servicios Sociales y Públicos

**VozYControl** es una aplicación web orientada a facilitar el acceso de la ciudadanía a información sobre derechos y servicios sociales y públicos. Busca que las personas puedan consultar información institucional de manera más clara, identificar los requisitos para acceder a los servicios y reportar posibles fallas, barreras o negaciones en su prestación.

El proyecto también propone funcionar como una herramienta de veeduría ciudadana y exigibilidad de derechos, promoviendo el seguimiento de situaciones que afectan a la comunidad y fortaleciendo el acceso a la información.

---

## Información académica

| Dato | Información |
|---|---|
| Proyecto | VozYControl |
| Grupo de trabajo | BY Defenders |
| Asignatura | Programación Orientada a la Web |
| Periodo académico | 2026B |
| Tipo de proyecto | Desarrollo de aplicación web |
| Enfoque metodológico | Feature-Driven Development (FDD) con ciclos cortos de trabajo |

### Integrantes

- **Huber Gonzalez**
- **Sebastian Truque**
- **Karol Bermudez**

---

## Problemática y justificación

El acceso a los servicios sociales y públicos puede verse limitado por la falta de información clara, la dificultad para identificar los procedimientos y requisitos institucionales o la ausencia de mecanismos sencillos para documentar y hacer seguimiento a las fallas en la prestación de dichos servicios.

VozYControl nace como una propuesta tecnológica para centralizar información útil y ofrecer un espacio en el que la ciudadanía pueda registrar situaciones relacionadas con fallas o negaciones de servicios. De esta manera, la plataforma busca contribuir a una ciudadanía mejor informada, participativa y con mayores herramientas para ejercer sus derechos.

## Objetivos

### Objetivo general

Desarrollar una plataforma web que facilite el acceso ciudadano a información sobre servicios sociales y públicos y que permita documentar situaciones que puedan afectar el ejercicio de los derechos.

### Objetivos específicos

- Democratizar el acceso a la información institucional.
- Facilitar la búsqueda de servicios mediante categorías y ubicación.
- Permitir la consulta de requisitos e información relevante para acceder a los servicios.
- Fortalecer la veeduría y la exigibilidad ciudadana mediante reportes documentados.
- Dinamizar la gestión y el seguimiento de los casos registrados.
- Proporcionar herramientas de consulta y administración de la información.

---

## Funcionalidades propuestas

La solución contempla los siguientes módulos:

| Módulo | Descripción |
|---|---|
| Registro de usuarios | Crear cuentas para acceder a las funcionalidades de la plataforma. |
| Buscador por categoría | Encontrar servicios según su área o tipo. |
| Filtro por ubicación | Facilitar la búsqueda de servicios de acuerdo con la ubicación. |
| Visualización de requisitos | Consultar los requisitos e información necesaria para acceder a cada servicio. |
| Reportes ciudadanos | Registrar fallas o posibles negaciones de servicios y documentarlas con evidencias. |
| Panel administrativo | Consultar y gestionar la información y los reportes recibidos. |
| Notificaciones | Informar sobre novedades relacionadas con los reportes y su seguimiento. |
| Preguntas frecuentes (FAQ) | Resolver dudas comunes sobre el uso de la plataforma y sus servicios. |

## Metodología de desarrollo

El proyecto adopta un enfoque ágil híbrido que combina **Feature-Driven Development (FDD)** con ciclos cortos de trabajo inspirados en Scrum. La organización del desarrollo se centra en construir funcionalidades concretas, revisarlas e integrarlas progresivamente.

El proceso contempla cuatro etapas:

1. **Modelado y definición de la base:** identificación de las entidades principales, como usuarios, servicios públicos y reportes, y definición de sus relaciones.
2. **Diseño de funcionalidades del MVP:** priorización de las funciones esenciales, comenzando por la consulta de servicios, seguida del registro de reportes y el panel administrativo.
3. **Desarrollo por iteraciones:** organización del trabajo en sprints de aproximadamente dos semanas, con entregas y revisiones periódicas.
4. **Construcción y validación:** desarrollo, prueba e integración de cada funcionalidad antes de incorporarla al conjunto de la aplicación.

### Planificación por sprints

| Sprint | Funcionalidades | Responsables | Fecha de entrega propuesta |
|---|---|---|---|
| 1 | Registro de usuarios y sección FAQ | Huber Gonzalez y Karol Bermudez | 17/10/2026 |
| 2 | Buscador por categoría, filtro por ubicación y visualización de requisitos | Sebastian Truque y Karol Bermudez | 31/10/2026 |
| 3 | Módulo de reportes ciudadanos de fallas o negación de servicios con evidencia | Huber Gonzalez | 14/11/2026 |
| 4 | Panel administrativo y sistema de notificaciones | Sebastian Truque y Karol Bermudez | 28/11/2026 |

*Las fechas corresponden a la planificación definida en la propuesta académica.*

---

## Diseño y navegación

La propuesta contempla prototipos de alta y baja fidelidad y un mapa de navegación jerárquico para organizar el recorrido de los usuarios por la plataforma.

La navegación se estructura alrededor de las acciones principales: consultar servicios, revisar información y requisitos, registrar reportes, acceder al perfil y consultar las opciones de administración.

## Tecnologías y arquitectura

La propuesta inicial contemplaba React.js para el frontend y PostgreSQL como base de datos. Durante la implementación técnica, el proyecto se adaptó a las siguientes tecnologías:

### Tecnologías utilizadas en la implementación actual

- **Frontend:** HTML5, CSS3 y JavaScript.
- **Backend:** Node.js 20 o superior y Express 5.
- **Base de datos:** MongoDB Atlas.
- **ODM:** Mongoose.
- **Carga de evidencias:** Multer.
- **Seguridad HTTP:** Helmet.
- **Control de solicitudes:** express-rate-limit.
- **Variables de entorno:** dotenv.
- **Control de versiones:** Git y GitHub.

### Base de datos

La aplicación utiliza MongoDB Atlas con una base de datos llamada `vozycontrol` y una colección `reportes`.

Los reportes almacenan información como:

- Categoría del servicio.
- Ubicación del hecho.
- Descripción de la situación.
- Nombre de referencia del usuario.
- Estado del reporte.
- Evidencia adjunta, cuando corresponde.
- Fechas de creación y actualización.

Los archivos admitidos para evidencias son JPG, PNG, WEBP y PDF, con un límite de 5 MB por archivo.

### API disponible

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/health` | Consultar el estado del servidor y la conexión. |
| GET | `/api/reportes` | Consultar los últimos reportes registrados. |
| POST | `/api/reportes` | Validar y guardar un nuevo reporte. |

El formulario de reportes envía los campos `categoria`, `ubicacion`, `descripcion`, `reporterName` y `evidencia` mediante `multipart/form-data`.

---

## Accesibilidad

La interfaz incorpora mejoras orientadas a facilitar el uso de la plataforma:

- Navegación mediante teclado y enlaces para saltar al contenido.
- Indicadores visibles de foco.
- Contraste de texto y componentes.
- Diseño adaptable a pantallas de escritorio, tabletas y celulares.
- Preferencia de movimiento reducido.
- Alternancia entre modo claro y modo oscuro.

Se tomaron como referencia criterios de accesibilidad WCAG 2.2 de niveles A, AA y AAA. Estas mejoras no representan una certificación de conformidad completa; se requieren evaluaciones automáticas y pruebas manuales para verificarla.

---

## Instalación y ejecución

### Requisitos

- Node.js 20 o superior.
- npm.
- Una instancia de MongoDB Atlas.
- Acceso al repositorio.

### Pasos

1. Clona el repositorio:

   ```bash
   git clone https://github.com/huberalexander23/VozYControl.git
   cd VozYControl
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea el archivo de variables de entorno a partir de la plantilla:

   ```bash
   cp .env.example .env
   ```

4. Abre el archivo `.env` y configura la URI de conexión de MongoDB Atlas en la variable `MONGODB_URI`.

5. Verifica que MongoDB Atlas permita la conexión desde tu entorno de desarrollo.

6. Inicia el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

7. Abre el puerto **3000** desde la sección Ports de GitHub Codespaces o visita `http://localhost:3000` si ejecutas el proyecto localmente.

> No compartas el archivo `.env` ni publiques credenciales o cadenas privadas de conexión.

## Seguridad y consideraciones

- Las variables privadas se configuran mediante el archivo local `.env`, que no debe subirse al repositorio.
- El servidor aplica cabeceras de seguridad y límites de solicitudes.
- La carga de evidencias está restringida por tipo y tamaño de archivo.
- El inicio de sesión de la interfaz conserva carácter demostrativo mientras no se integre un servicio completo de autenticación.
- Antes de utilizar la plataforma con información personal real deben completarse la autenticación, la autorización por usuario, los controles de privacidad y las pruebas de seguridad correspondientes.

## Estructura principal del proyecto

```text
VozYControl/
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── index.html
├── login.html
├── panel.html
├── reportar.html
├── perfil.html
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

El repositorio también contiene los diagramas de dominio, clases y casos de uso elaborados para el análisis y diseño del sistema.

## Repositorio

Código fuente y evolución del proyecto:

[github.com/huberalexander23/VozYControl](https://github.com/huberalexander23/VozYControl)

---

**VozYControl — BY Defenders**  
*Proyecto académico de la asignatura Programación Orientada a la Web · 2026B*
