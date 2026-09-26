# Diagrama de Casos de Uso - VozYControl

Este diagrama ilustra las interacciones de los actores principales (**Ciudadano / Veedor** y **Administrador**) con las funcionalidades del sistema **VozYControl**.

```mermaid
flowchart TB
    subgraph Actores
        Ciudadano([Ciudadano / Veedor])
        Admin([Administrador])
    end

    subgraph Sistema VozYControl
        UC1[Registrarse / Iniciar Sesión]
        UC2[Buscar Servicios y Filtrar por Ubicación]
        UC3[Consultar Requisitos y FAQ]
        UC4[Crear Reporte Ciudadano con Evidencias]
        UC5[Consultar Estado de Reportes]
        UC6[Gestionar y Revisar Reportes]
        UC7[Actualizar Oferta de Servicios]
    end

    Ciudadano --> UC1
    Ciudadano --> UC2
    Ciudadano --> UC3
    Ciudadano --> UC4
    Ciudadano --> UC5

    Admin --> UC1
    Admin --> UC6
    Admin --> UC7
