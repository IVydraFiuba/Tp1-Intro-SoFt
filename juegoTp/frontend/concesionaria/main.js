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
            .then(cargar_tienda)
            .catch((error) => console.log("ERROR", error))

            function cargar_tienda(contenido){
                const contenedor_tienda = document.getElementById("contenedor_tienda")
                for (let index = 0; index < contenido.length; index++) {
                    contenedor_tienda.innerHTML += `
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
                    `}
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




let dataTableinicializada=false;

function iniciar_data_table(){
    if (dataTableinicializada){
        dataTable.destroy();
        const tabla = document.getElementById("tabla_autos");
        tabla.innerHTML = "";
        }
    fetch("http://localhost:5000/garaje/"+id)
        .then((respuesta) => respuesta.json())
        .then(cargar_tabla)
        .catch((error) => console.log("ERROR", error))
        };

        function cargar_tabla(contenido) {
            const tabla = document.getElementById("tabla_autos");
            for (let index = 0; index < contenido.length; index++) {
                tabla.innerHTML+=`
                    <tr>
                        <td><img src="data:image/jpeg;base64,${contenido[index].Imagen}" class="card-img-top" style="width:300px;height:auto;"></td>  
                        <td>${contenido[index].Marca}</td>
                        <td>${contenido[index].Modelo}</td>
                        <td>${contenido[index].Año}</td>
                        <td>${contenido[index].Nivel}</td>
                        <td>${contenido[index].Precio} $</td>
                        <td>
                            <button type="button" class="btn btn-primary position-relative">Ofertas
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">5<span class="visually-hidden">unread messages</span></span>
                            </button>
                        </td>                         
                        <td>
                            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                <button type="button" class="btn btn-danger">Left</button>
                                <button type="button" class="btn btn-warning">Middle</button>
                                <button type="button" class="btn btn-success">Right</button>
                            </div>
                        </td>
                    </tr>
                `
            }
            dataTable=$("#datatable_garaje").DataTable(ConfigDataTable);
            dataTableinicializada = true;
        }
        function manejo_error(error) {
            console.log("Error!", error)
        }
        
        let dataTable;
        const ConfigDataTable = {
            columnDefs:[{orderable:false,targets: 5}],
            lengthMenu:[5,10,20,40],
            pageLength: 5,
            destroy:true,
            language:{
                lengthMenu: "Mostrar _MENU_ autos por pagina",
                zeroRecords: "Ningun auto encontrado",
                info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ autos",
                infoEmpty: "Ningun auto encontrado",
                infoFiltered: "(filtrados desde _MAX_ autos totales)",
                search: "Buscar:",
                loadingRecords: "Cargando...",
                paginate:{
                    first: "Primero",
                    last: "Ultimo",
                    next: "Siguiente",
                    previous: "Anterior"
                }
            }
        }

iniciar_data_table()