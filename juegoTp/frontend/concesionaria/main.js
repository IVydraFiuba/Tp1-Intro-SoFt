let parametros = window.location.search;
let id = new URLSearchParams(parametros).get("id")

const link_comprar = document.getElementById("link_comprar")
link_comprar.setAttribute("href", `comprar?id=${id}`);

fetch("http://localhost:5000/usuarios/"+id)
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))

            function cargar_datos(contenido){
                const contenedor_nombre = document.getElementById("Nombre_concesionaria")
                contenedor_nombre.innerText = contenido.Nombre
                const contenedor_plata = document.getElementById("Plata_usuario")
                contenedor_plata.innerText = contenido.Plata
            }