# VozYControl

Plataforma de Defensa y Acceso a Servicios Sociales y Públicos. ODS: Reducción de Desigualdades.

## 1. Diagrama de Dominio (Modelo Entidad-Relación - ER)

```mermaid
erDiagram
    USUARIO ||--o{ REPORTE_CIUDADANO : crea
    SERVICIO_PUBLICO ||--o{ REPORTE_CIUDADANO : genera_incidencia_en
    CATEGORIA ||--o{ SERVICIO_PUBLICO : categoriza
    UBICACION ||--o{ SERVICIO_PUBLICO : ubica
    
    USUARIO {
        int idUsuario PK
        string nombre
        string correo
        string password
        string rol
    }
    SERVICIO_PUBLICO {
        int idServicio PK
        string nombre
        string descripcion
        string requisitos
    }
    CATEGORIA {
        int idCategoria PK
        string nombreCategoria
    }
    UBICACION {
        int idUbicacion PK
        string ciudadComuna
    }
    REPORTE_CIUDADANO {
        int idReporte PK
        string descripcionFalla
        string evidenciaUrl
        string estado
        datetime fechaCreacion
    }

classDiagram
    class Usuario {
        +int idUsuario
        +string nombre
        +string correo
        +string contrasena
        +string rol
        +registrarse()
        +iniciarSesion()
        +actualizarPerfil()
    }
    class ServicioPublico {
        +int idServicio
        +string nombre
        +string descripcion
        +string requisitos
        +consultarRequisitos()
        +filtrarPorZona()
    }
    class Categoria {
        +int idCategoria
        +string nombreCategoria
    }
    class Ubicacion {
        +int idUbicacion
        +string zona
    }
    class ReporteCiudadano {
        +int idReporte
        +string descripcionFalla
        +string evidenciaUrl
        +string estado
        +datetime fechaCreacion
        +crearReporte()
        +adjuntarEvidencia()
        +consultarEstado()
    }

    Usuario "1" --> "*" ReporteCiudadano : crea
    ServicioPublico "1" --> "*" ReporteCiudadano : asociado a
    Categoria "1" --> "*" ServicioPublico : agrupa
    Ubicacion "1" --> "*" ServicioPublico : localiza

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
