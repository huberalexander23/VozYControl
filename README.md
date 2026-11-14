# VozYControl

**Plataforma de Defensa y Acceso a Servicios Sociales y Públicos** — BY Defenders.

## Prototipo visual

La interfaz se ajustó tomando como referencia la sección **5.1 Prototipos de Pantallas (página 4)** y el **5.2 Mapa de Navegación (página 5)** de la propuesta del proyecto.

- **Inicio:** buscador, filtros por Salud, Agua, Educación y Energía y tarjetas de servicios cercanos.
- **Acceso:** pestañas para iniciar sesión y registrarse.
- **Panel:** saludo al usuario, resumen de reportes activos y resueltos y listado con estados.
- **Nuevo reporte:** categoría, ubicación, descripción y carga opcional de evidencia en imagen o PDF.
- **Perfil:** vista básica de los datos del usuario de demostración.

La navegación principal permite ir a Inicio, Buscar, Reportar y Perfil. El diseño usa una composición estrecha y adaptable para conservar la apariencia de la propuesta móvil. El selector «Oscuro/Claro» está disponible en las pantallas y recuerda la elección en el navegador.

## Accesibilidad web — WCAG 2.2

Se incorporaron mejoras de accesibilidad basadas en la guía de clase:

### Nivel A
1. **1.1.1 Alternativas textuales:** los iconos decorativos se ocultan a lectores de pantalla y los controles tienen etiquetas.
2. **2.4.1 Evitar bloques:** cada página incluye el enlace «Saltar al contenido principal».

### Nivel AA
1. **1.4.3 Contraste mínimo:** se definieron combinaciones de texto y fondo para facilitar la lectura; falta medir todos los estados con una herramienta de contraste.
2. **2.4.7 Foco visible:** enlaces, botones y campos muestran un indicador visible al navegar con teclado.

### Nivel AAA
1. **1.4.6 Contraste mejorado:** se priorizaron combinaciones de contraste alto; la conformidad debe confirmarse midiendo cada combinación.
2. **2.3.3 Animación por interacción:** se respeta `prefers-reduced-motion` para reducir movimiento y transiciones.

> Incluir algunos criterios AAA no significa que toda la aplicación tenga conformidad AAA. Se requieren pruebas manuales y automáticas.

## Archivos principales

- `index.html`: inicio, buscador y filtros.
- `login.html`: inicio de sesión y registro de demostración.
- `panel.html`: resumen y seguimiento ilustrativo de reportes.
- `reportar.html`: formulario y validación de un reporte.
- `perfil.html`: perfil de demostración.
- `css/styles.css`: estilos adaptables, accesibilidad y paletas clara/oscura.
- `js/main.js`: filtros, pestañas, validación, selector de tema y navegación de demostración.

## Alcance actual

Este repositorio sigue siendo un **prototipo frontend**. Los datos del panel son ilustrativos. El acceso permite recorrer el flujo de demostración, pero no autentica usuarios ni crea cuentas reales. El formulario valida la información, pero no publica ni almacena reportes o evidencias. Para completar esas funciones se requiere conectar el backend y la base de datos previstos en la propuesta (Node.js con Express y PostgreSQL).

## Referencias

- Propuesta de Proyecto VozYControl (documento de referencia del equipo; no forma parte de los archivos del repositorio).
- [Guía de clase: WCAG 2.2](https://github.com/dfloaizab/WebProgramming/blob/main/2025A/Unidad3/Accesibility/readme.md)
- [W3C — WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
