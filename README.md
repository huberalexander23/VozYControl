# VozYControl

Plataforma de Defensa y Acceso a Servicios Sociales y Públicos. ODS: Reducción de Desigualdades.

## Accesibilidad web — WCAG 2.2

Se incorporaron mejoras de accesibilidad basadas en la guía de clase de WCAG 2.2:

### Nivel A — Básico
1. **1.1.1 Alternativas textuales:** los iconos decorativos usan `aria-hidden="true"`, los controles tienen etiquetas y los formularios identifican campos obligatorios.
2. **2.4.1 Evitar bloques:** cada página incluye el enlace “Saltar al contenido principal”, que permite omitir la navegación repetida.

### Nivel AA — Estándar
1. **1.4.3 Contraste (mínimo):** se definieron colores de texto y fondos con contraste reforzado para lectura, incluidos enlaces, botones, etiquetas y mensajes.
2. **2.4.7 Foco visible:** los enlaces, botones y campos muestran un indicador de foco visible y de alto contraste al navegar con teclado.

### Nivel AAA — Mejorado
1. **1.4.6 Contraste (mejorado):** se eligieron combinaciones de texto y fondo de alto contraste (objetivo de 7:1 para texto normal y 4.5:1 para texto grande). La verificación final debe hacerse con un medidor de contraste.
2. **2.3.3 Animación por interacción:** la hoja de estilos respeta `prefers-reduced-motion` para reducir animaciones y desplazamientos cuando el usuario lo solicita en su sistema.

> Nota: los criterios AAA son más exigentes y su inclusión no implica que todo el sitio tenga conformidad AAA. Se deben verificar todas las vistas y estados con pruebas manuales y automáticas.

## Archivos principales

- `index.html`: búsqueda y filtros de servicios.
- `login.html`: pestañas de inicio de sesión y registro.
- `panel.html`: panel y estado de reportes.
- `reportar.html`: formulario accesible con validación.
- `css/styles.css`: diseño adaptable, foco visible, objetivos táctiles y movimiento reducido.
- `js/main.js`: filtros, pestañas navegables con teclado y mensajes de validación.

## Alcance funcional

Este repositorio es un prototipo de interfaz. El inicio de sesión, el registro y el envío/almacenamiento de reportes requieren un backend; la interfaz no afirma que esas operaciones se hayan completado.

## Referencias

- [Guía de clase: Guía de Implementación WCAG 2.2](https://github.com/dfloaizab/WebProgramming/blob/main/2025A/Unidad3/Accesibility/readme.md)
- [W3C — WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [W3C — Understanding Success Criterion 1.1.1: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
- [W3C — Understanding Success Criterion 2.4.1: Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
- [W3C — Understanding Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — Understanding Success Criterion 2.4.7: Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- [W3C — Understanding Success Criterion 1.4.6: Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html)
- [W3C — Understanding Success Criterion 2.3.3: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
