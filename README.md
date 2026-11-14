# VozYControl

Plataforma ciudadana de defensa y acceso a servicios sociales y públicos.

## Tecnologías

- Node.js 20 o superior
- Express 5
- MongoDB Atlas y Mongoose
- Multer para evidencias
- Helmet y express-rate-limit
- HTML, CSS y JavaScript

## Instalación

1. Abre el repositorio en GitHub Codespaces.
2. Instala las dependencias: `npm install`.
3. Crea el archivo local de variables: `cp .env.example .env`.
4. En `.env`, configura la URI real de MongoDB Atlas. No publiques ese archivo.
5. En Atlas, habilita el acceso de red desde Codespaces.
6. Inicia el servidor: `npm run dev`.
7. Abre el puerto 3000 en la pestaña Ports.

## MongoDB Atlas

- Base de datos: `vozycontrol`
- Colección: `reportes`
- Índice: `reportes_fecha_creacion`

Cada reporte contiene categoría, ubicación, descripción, usuario de demostración, estado, evidencia opcional y fechas de creación/actualización. Los adjuntos permitidos son JPG, PNG, WEBP y PDF, con un límite de 5 MB.

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servidor y conexión |
| GET | `/api/reportes` | Consulta los últimos 100 reportes |
| POST | `/api/reportes` | Valida y guarda un reporte |

El formulario envía `multipart/form-data` con `categoria`, `ubicacion`, `descripcion`, `reporterName` y `evidencia`.

## Seguridad

- `.env` está excluido de Git.
- No guardes contraseñas ni URI privadas en el repositorio.
- Se limita el tamaño de archivos y la frecuencia de solicitudes.
- La consulta de reportes todavía no tiene autorización por usuario. El inicio de sesión sigue siendo demostrativo. No utilizar con datos personales reales hasta incorporar autenticación, autorización y controles de privacidad.
- Ejecuta `npm audit` para revisar dependencias y `npm audit fix` para actualizaciones compatibles. No utilices `--force` sin revisar cambios mayores.
- Conserva `package-lock.json` generado por `npm install` y súbelo al repositorio para fijar las versiones instaladas.

## Accesibilidad WCAG 2.2

Se incorporaron mejoras basadas en:
- A: 1.1.1 y 2.4.1.
- AA: 1.4.3 y 2.4.7.
- AAA: 1.4.6 y 2.3.3.

La incorporación de estos criterios no certifica conformidad completa. Se requieren pruebas automáticas y manuales.

## Estructura

- `server.js`: servidor y API.
- `package.json`: dependencias y comandos.
- `.env.example`: plantilla de variables.
- `index.html`, `login.html`, `panel.html`, `reportar.html`, `perfil.html`: pantallas.
- `css/styles.css`: diseño adaptable y temas.
- `js/main.js`: interacciones y consumo de API.
- Diagramas en Markdown.
