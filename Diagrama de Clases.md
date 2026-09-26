# Diagrama de Clases - VozYControl

Este diagrama detalla los atributos y operaciones (*métodos*) clave de las clases lógicas del sistema, sirviendo como plano de diseño orientado a objetos para el desarrollo de la aplicación.

```mermaid
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
