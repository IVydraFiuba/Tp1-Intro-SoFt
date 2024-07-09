let parametros = window.location.search;
var id = new URLSearchParams(parametros).get("id")

const link_concesionaria = document.getElementById("link_concesionaria")
link_concesionaria.setAttribute("href", `..?id=${id}`);

fetch("http://localhost:5000/usuarios/"+id)
            .then((respuesta) => respuesta.json())
            .then(cargar_datos_usuario)
            .catch((error) => console.log("ERROR", error))

            function cargar_datos_usuario(contenido){
                const contenedor_nombre = document.getElementById("Nombre_concesionaria")
                contenedor_nombre.innerText = contenido.Nombre
                const contenedor_plata = document.getElementById("Plata_usuario")
                contenedor_plata.innerText = contenido.Plata
            }

fetch("http://localhost:5000/autos")
            .then((respuesta) => respuesta.json())
            .then(cargar_datos_autos)
            .catch((error) => console.log("ERROR", error))

            function cargar_datos_autos(contenido){
                const contenedor_tienda = document.getElementById("contenedor_tienda")
                const tarjeta_auto = document.createElement('div');
                tarjeta_auto.setAttribute("class","row row-cols-1 row-cols-md-3 g-4")
                tarjeta_auto.innerHTML = `
                <div class="col">
                <div class="card h-100">
                    <img src="data:image/jpeg;base64,${contenido[0].Imagen}" class="card-img-top">
                    <div class="card-body">
                        <h5class="card-title">${contenido[0].Marca} ${contenido[0].Modelo}</h5>
                        <p class="card-text">Datos del auto...
                        ...
                        ...
                        </p>
                    </div>
                    <div class="card-footer">
                        <small class="text-body-secondary">${contenido[0].Precio}$</small>
                        <button onclick="comprar_auto(${contenido[0].Id},${id})" type="button" class="btn btn-success" >Comprar</button>
                    </div>
                </div>
            </div>
                `
            contenedor_tienda.appendChild(tarjeta_auto);
            }
function comprar_auto(auto_id,id){
    fetch("http://localhost:5000/comprar_auto",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_auto: auto_id,
            id_usuario:id
        })
    })
    .then((respuesta) => respuesta.json())
    .then(procesar_respuesta)
    .catch((error) => console.log("ERROR", error))
}
function procesar_respuesta(data) {
    if (data.success) {
        alert("Comprado con exito")

        } 
    else {
        alert("Error al realizar la compra ")
    }
}
