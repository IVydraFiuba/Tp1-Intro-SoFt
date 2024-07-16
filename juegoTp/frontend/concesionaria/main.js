let parametros = window.location.search;
let id = new URLSearchParams(parametros).get("id")
let nivel_tienda 
let giros

fetch("http://localhost:5000/usuarios/"+id)
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))

            function cargar_datos(contenido){
                nivel_tienda = contenido.Tienda.Nivel
                giros = contenido.Tienda.Giros
                const contenedor_nombre = document.getElementById("Nombre_concesionaria")
                contenedor_nombre.innerText = contenido.Nombre_concesionaria
                const contenedor_plata = document.getElementById("Plata_usuario")
                contenedor_plata.innerText = contenido.Plata
                const contenedor_dia = document.getElementById("Dia_usuario")
                contenedor_dia.innerText = contenido.Dia
            }

            function iniciar_dia(){
                const boton_iniciar = document.getElementById("boton_iniciar_dia")
                boton_iniciar.setAttribute("hidden","")
                const contenedor_tiempo = document.getElementById("tiempo")
                contenedor_tiempo.removeAttribute("hidden")
                const boton_tienda = document.getElementById("boton_tienda")
            
                let hora_actual = 8
            
                function actualizar_hora(){
                    hora_actual+=1
                    if (hora_actual == 20){
                        clearInterval(intervalo)
                        console.log("Dia terminado.")
                        contenedor_tiempo.setAttribute("hidden","")
                        const boton_pasar = document.getElementById("boton_pasar_dia")
                        boton_pasar.removeAttribute("hidden")
                        boton_tienda.setAttribute("disabled","")
                    }else{
                        if(hora_actual == 10)
                            iniciar_tienda()
                        if(hora_actual > 12){
                            contenedor_tiempo.textContent =`${hora_actual - 12}:00 PM`
                        }else{
                            contenedor_tiempo.textContent =`${hora_actual}:00 AM`
            
                        }
                    }}
                function iniciar_tienda(){
                    boton_tienda.removeAttribute("disabled")
                    fetch("http://localhost:5000/autos/"+nivel_tienda)
                        .then((respuesta) => respuesta.json())
                        .then(cargar_tienda)
                        .catch((error) => console.log("ERROR", error))
            
                    function cargar_tienda(lista_autos){
                        const contenedor_tienda = document.getElementById("contenedor_tienda")
                        girar_tienda(lista_autos,giros)
                        contenedor_tienda.innerHTML += `<button onclick="girar_tienda(${lista_autos},${giros})" type="button" class="btn btn-success">Giro</button>`
            
                    function girar_tienda(lista_autos,giros){
                        let autos_tienda = mesclar_autos(lista_autos)
                        contenedor_tienda.innerHTML = ""
                        for (let index = 0; index < autos_tienda.length; index++) {
                            contenedor_tienda.innerHTML += `
                            <div class="col">
                                <div class="card h-100">
                                    <img src="data:image/jpeg;base64,${lista_autos[index].Imagen}" class="card-img-top">
                                    <div class="card-body">
                                        <h5 class="card-title">${lista_autos[index].Marca} ${lista_autos[index].Modelo}</h5>
                                        <p class="card-text">Datos del auto...
                                        ...
                                        ...
                                        </p>
                                    </div>
                                    <div class="card-footer">
                                        <small class="text-body-secondary">${lista_autos[index].Precio}$</small>
                                        <button onclick="comprar_auto(${lista_autos[index].Id},${id})" type="button" class="btn btn-success" >Comprar</button>
                                    </div>
                                </div>
                            </div>
                                    `}
                                }
                            }
                    function mesclar_autos(lista_autos){
                        const autos_tienda = []
                        const copia_lista_autos = lista_autos.slice()
                        for (let i = 0; i < 3; i++) {
                            const index_aleatorio = Math.floor(Math.random() * copia_lista_autos.length)
                            autos_tienda.push(copia_lista_autos[index_aleatorio]);
                            copia_lista_autos.splice(index_aleatorio, 1);
                            }
                    return autos_tienda;
                    }
                    
                }
                let intervalo = setInterval(actualizar_hora,1000)
            }

function comprar_auto(auto_id,id){
    fetch("http://localhost:5000/garaje/"+id,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id_auto: auto_id})
        })
    .then((respuesta) => respuesta.json())
    .then(procesar_respuesta_comprar)
    .catch((error) => console.log("ERROR", error))
}
function procesar_respuesta_comprar(data) {
    if (data.success) {
        alert("Comprado con exito")
        iniciar_data_table()
        } 
    else {
        alert("Error al realizar la compra ")
    }
}

// function mejorar_tienda(){

//     fetch("http://localhost:5000/usuarios/"+id, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ Nivel: nivel_tienda-1 })
//     })
//     .then((respuesta) => respuesta.json())
//     .then(procesar_respuesta_nivel)
//     .catch((error) => console.log("ERROR", error))
// }

// function procesar_respuesta_nivel(data){
//     if (data.success) {
//         alert("Mejorado con exito")
//         location.reload();
//         } 
//     else {
//         alert("Error al realizar la mejora ")
//     }
// }

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