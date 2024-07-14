let parametros = window.location.search;
let id = new URLSearchParams(parametros).get("id")

fetch("http://localhost:5000/usuarios/"+id)
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))

            function cargar_datos(contenido){
                const contenedor_nombre = document.getElementById("Nombre_concesionaria")
                contenedor_nombre.innerText = contenido.Concesionaria.Nombre
                const contenedor_plata = document.getElementById("Plata_usuario")
                contenedor_plata.innerText = contenido.Plata
                const contenedor_dia = document.getElementById("Dia_usuario")
                contenedor_dia.innerText = contenido.Dia
            }


            fetch("http://localhost:5000/autos")
            .then((respuesta) => respuesta.json())
            .then(cargar_datos_autos)
            .catch((error) => console.log("ERROR", error))

            function cargar_datos_autos(contenido){
                const contenedor_tienda = document.getElementById("contenedor_tienda")
                for (let index = 0; index < contenido.length; index++) {
                    const tarjeta_auto = document.createElement('div');
                    tarjeta_auto.setAttribute("class","row row-cols-1 row-cols-md-3 g-4")
                    tarjeta_auto.innerHTML = `
                    <div class="col">
                    <div class="card h-100">
                        <img src="data:image/jpeg;base64,${contenido[index].Imagen}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${contenido[index].Marca} ${contenido[index].Modelo}</h5>
                            <p class="card-text">Datos del auto...
                            ...
                            ...
                            </p>
                        </div>
                        <div class="card-footer">
                            <small class="text-body-secondary">${contenido[index].Precio}$</small>
                            <button onclick="comprar_auto(${contenido[index].Id},${id})" type="button" class="btn btn-success" >Comprar</button>
                        </div>
                    </div>
                    </div>
                    `
                    contenedor_tienda.appendChild(tarjeta_auto);}
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
        location.reload();
        } 
    else {
        alert("Error al realizar la compra ")
    }
}