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
