# VozYControl

**Plataforma de Defensa y Acceso a Servicios Sociales y Públicos** — BY Defenders.

## Funcionalidades

- Inicio con buscador, filtros por Salud, Agua, Educación y Energía.
- Acceso y registro de demostración.
- Panel que consulta reportes almacenados en MongoDB.
- Formulario para crear reportes con categoría, ubicación, descripción y evidencia opcional.
- Evidencias JPG, PNG, WEBP o PDF de hasta 5 MB, almacenadas junto al reporte.
- Perfil de demostración.
- Diseño adaptable a escritorio y móviles, modo claro/oscuro persistente.

## Tecnologías

- Node.js 20 o superior.
- Express 5 para el servidor y la API REST.
- MongoDB Atlas con Mongoose.
- Multer para recibir evidencias.
- Helmet y express-rate-limit para cabeceras de seguridad y limitación de solicitudes.
- HTML, CSS y JavaScript en el frontend.

## Base de datos MongoDB Atlas

El proyecto Atlas asociado es **VozYControl**, con el clúster **Cluster0**.

| Recurso | Nombre |
|---|---|
| Base de datos | `vozycontrol` |
| Colección | `reportes` |
| Índice | `reportes_fecha_creacion` sobre `createdAt` descendente |

Cada documento de `reportes` contiene:

- `category`: Agua potable, Salud, Educación o Energía.
- `location`: ubicación del hecho.
- `description`: descripción del reporte.
- `reporterName`: nombre de demostración del usuario.
- `status`: Pendiente, En curso o Resuelto. Los nuevos reportes comienzan como Pendiente.
- `evidence`: archivo opcional con nombre, tipo MIME, tamaño y contenido binario.
- `createdAt` y `updatedAt`: fechas administradas por Mongoose.

## Configuración local o en GitHub Codespaces

1. Abre el repositorio y actualiza la rama `main`.
2. Instala Node.js 20 o superior.
3. Copia el archivo de ejemplo:

   ```bash
   cp .env.example .env
   ```

4. En MongoDB Atlas, abre **Database & Network Access → Database Users** y utiliza el usuario de base de datos `vozycontrol`. Si no recuerdas su contraseña, restablécela en Atlas.
5. Abre el archivo local `.env` y reemplaza `TU_PASSWORD` en `MONGODB_URI` por la contraseña del usuario. Si la contraseña contiene caracteres especiales, codifícala para URL.
6. En **Network Access** de Atlas, permite la conexión desde el entorno donde corre Codespaces. Para una demostración temporal puede usarse `0.0.0.0/0`, pero no es recomendable para producción; restringe el acceso cuando tengas una IP de salida estable.
7. Ejecuta:

   ```bash
   npm install
   npm run dev
   ```

8. En Codespaces, abre la pestaña **Ports**, localiza el puerto **3000** y selecciona **Open in Browser**.

El archivo `.env` está excluido por `.gitignore`. **No subas contraseñas ni cadenas privadas de conexión a GitHub.** El archivo `.env.example` contiene únicamente una plantilla.

## API REST

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/health` | Comprueba que el servidor y la conexión estén activos. |
| GET | `/api/reportes` | Devuelve los últimos 100 reportes, sin el contenido binario de los adjuntos. |
| POST | `/api/reportes` | Valida y guarda un reporte y su evidencia opcional. |

El formulario envía `multipart/form-data`. Los campos son `categoria`, `ubicacion`, `descripcion`, `reporterName` y `evidencia`.

## Seguridad y alcance

Esta entrega conecta el formulario y el panel con MongoDB Atlas. El flujo de inicio de sesión y registro continúa siendo demostrativo: **todavía no existe autenticación real ni autorización por usuario**. Por ello, el endpoint de consulta no debe exponerse con datos personales reales ni utilizarse en producción hasta incorporar autenticación, autorización para consultar únicamente los reportes propios, políticas de privacidad y controles de acceso a evidencias.

La API limita el tamaño de los archivos a 5 MB, valida tipos permitidos y limita la frecuencia de solicitudes. Las evidencias se guardan como datos binarios en documentos MongoDB; evalúa GridFS o almacenamiento de objetos si el volumen crece.

## Accesibilidad WCAG 2.2

Se incorporaron mejoras basadas en seis criterios:

### Nivel A
- **1.1.1 Alternativas textuales:** iconos decorativos ocultos a lectores de pantalla y controles etiquetados.
- **2.4.1 Evitar bloques:** enlace para saltar al contenido principal.

### Nivel AA
- **1.4.3 Contraste mínimo:** combinaciones de texto y fondo ajustadas; se deben medir todos los estados.
- **2.4.7 Foco visible:** indicador visible al navegar con teclado.

### Nivel AAA
- **1.4.6 Contraste mejorado:** se priorizaron combinaciones de mayor contraste; falta medir cada combinación.
- **2.3.3 Animación por interacción:** soporte para `prefers-reduced-motion`.

La inclusión de estos criterios no certifica conformidad completa A, AA o AAA. Se requieren pruebas automáticas y manuales.

## Archivos principales

- `server.js`: servidor Express y API.
- `package.json`: dependencias y comandos npm.
- `.env.example`: plantilla de configuración.
- `.gitignore`: excluye secretos y dependencias.
- `index.html`, `login.html`, `panel.html`, `reportar.html`, `perfil.html`: pantallas.
- `css/styles.css`: estilos adaptables y temas.
- `js/main.js`: interacciones, envío de reportes y carga del panel.
