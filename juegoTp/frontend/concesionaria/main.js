let parametros = window.location.search;
let id = new URLSearchParams(parametros).get("id")

let dia 
let plata
let nivel_tienda
let id_tienda 
let giros

fetch("http://localhost:5000/usuarios/"+id)
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))

            function cargar_datos(contenido){
                nivel_tienda = contenido.Tienda.Nivel
                id_tienda = contenido.Tienda.Id
                giros = contenido.Tienda.Giros
                dia = contenido.Dia
                plata = contenido.Plata

                const contenedor_nombre = document.getElementById("Nombre_concesionaria")
                contenedor_nombre.innerText = contenido.Nombre_concesionaria
                const contenedor_plata = document.getElementById("Plata_usuario")
                contenedor_plata.innerText = plata
                const contenedor_dia = document.getElementById("Dia_usuario")
                contenedor_dia.innerText = dia
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
        const precio_mejora= document.getElementById("precio_mejora")
        if (nivel_tienda == 3){
            precio_mejora.innerText = 15000
        }else if(nivel_tienda == 2){
                precio_mejora.innerText = 40000
            }else{
                precio_mejora.innerText = "MAX"
            }
        fetch("http://localhost:5000/autos/"+nivel_tienda)
            .then((respuesta) => respuesta.json())
            .then(cargar_tienda)
            .catch((error) => console.log("ERROR", error))
    }
    let intervalo = setInterval(actualizar_hora,1000)
}
function cargar_tienda(lista_autos){
    const contenedor_tienda = document.getElementById("contenedor_tienda")
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
                    <button id="boton_${index}" onclick="comprar_auto(${lista_autos[index].Id},${id},${index})" type="button" class="btn btn-success" >Comprar</button>
                </div>
            </div>
        </div>
                `}
    contenedor_tienda.innerHTML += `<button onclick='girar_tienda(${JSON.stringify(lista_autos)}, ${giros})' type="button" class="btn btn-success">Giro</button>`
}
function mesclar_autos(lista_autos){
    const autos_tienda = []
    const copia_lista_autos = lista_autos.slice()
    for (let i = 0; i < 3; i++) {
        const index_aleatorio = Math.floor(Math.random() * copia_lista_autos.length)
        autos_tienda.push(copia_lista_autos[index_aleatorio]);
        copia_lista_autos.splice(index_aleatorio, 1);
        }
    return autos_tienda;}

function girar_tienda(lista_autos){
    if (giros > 0){
        giros -= 1
        let body
        body = {Giros_actualizados: giros}
        fetch("http://localhost:5000/tienda_giros/"+id_tienda,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)})
        .then((respuesta) => respuesta.json())
        .then(procesar_respuesta_giros)
        .catch((error) => console.log("ERROR", error))
        
        function procesar_respuesta_giros(data){
            if (data.success) {
                cargar_tienda(lista_autos)
            } 
            else {
                alert(data.message)
            }
        }
        }else{
        alert("No te quedan mas giros")
    }
}

function comprar_auto(auto_id,id,indice_boton){
    fetch("http://localhost:5000/garaje/"+id,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id_auto: auto_id,indice_boton: indice_boton})
        })
    .then((respuesta) => respuesta.json())
    .then(procesar_respuesta_comprar)
    .catch((error) => console.log("ERROR", error))
}
function procesar_respuesta_comprar(data) {
    if (data.success) {
        alert("Comprado con exito")
        const boton_compra = document.getElementById(`boton_${data.indice_boton}`)
        boton_compra.setAttribute("disabled","")
        const contenedor_plata = document.getElementById("Plata_usuario")
        contenedor_plata.innerText = data.Plata
        iniciar_data_table()
        } 
    else {
        alert("Error al realizar la compra ")
    }
}

function mejorar_tienda(){
    if (!(nivel_tienda == 1)){
        nivel_tienda -= 1
        let body
        body = {Nivel_actualizado: nivel_tienda}
        fetch("http://localhost:5000/tienda_nivel/"+id_tienda,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)})
        .then((respuesta) => respuesta.json())
        .then(procesar_respuesta_nivel)
        .catch((error) => console.log("ERROR", error))
        
        function procesar_respuesta_nivel(data){
            if (data.success) {
                const precio_mejora= document.getElementById("precio_mejora")
                if(nivel_tienda == 2){
                    precio_mejora.innerText = 40000
                }else{
                    precio_mejora.innerText = "MAX"
                }
                fetch("http://localhost:5000/autos/"+nivel_tienda)
                    .then((respuesta) => respuesta.json())
                    .then(cargar_tienda)
                    .catch((error) => console.log("ERROR", error))
            } 
            else {
                alert(data.message)
            }
        }
        }else{
        alert("Nivel maximo alcanzado")
    }
}


let dataTableinicializada=false;
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
                                <button hidden onclick="sacar_de_venta(${contenido[index].Id_garaje})" id="boton_sacar_venta_${contenido[index].Id_garaje}" type="button" class="btn btn-outline-danger">Sacar de la venta</button>
                                <button id="boton_vender_${contenido[index].Id_garaje}"  type="button" class="btn btn-outline-success btn-lg" data-bs-toggle="modal" data-bs-target="#ventana_modal_vender_${contenido[index].Id_garaje}">Poner en venta</button>
                        <div class="modal fade" id="ventana_modal_vender_${contenido[index].Id_garaje}" tabindex="-1" data-bs-backdrop="static">
                            <div class="modal-dialog modal-dialog-centered modal-xl">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h2 class="modal-title">Elije el precio de venta...</h2>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">  
                                        <div class="row row-cols-md-3 g-4">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Imagen</th>
                                                        <th>Nivel</th>
                                                        <th>Precio de compra</th>
                                                        <th>Precio de venta</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><img src="data:image/jpeg;base64,${contenido[index].Imagen}" class="card-img-top" style="width:300px;height:auto;"></td>
                                                        <td>${contenido[index].Nivel}</td>
                                                        <td>${contenido[index].Precio} $</td>
                                                        <td>
                                                            <form onsubmit="poner_en_venta(event,${contenido[index].Id_garaje})">
                                                                <input type="text" class="form-control" name="precio_venta" placeholder="${contenido[index].Precio } $" required>
                                                                <button type="submit" class="btn btn-success">Presentar oferta</button>
                                                            </form>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            </div>
                        </td>
                    </tr>
                    `
                if (contenido[index].En_venta){
                    const boton_venta = document.getElementById(`boton_vender_${contenido[index].Id_garaje}`)
                    boton_venta.setAttribute("hidden","")
                    const boton_sacar_venta = document.getElementById(`boton_sacar_venta_${contenido[index].Id_garaje}`)
                    boton_sacar_venta.removeAttribute("hidden")
                }
            }
            dataTable=$("#datatable_garaje").DataTable(ConfigDataTable);
            dataTableinicializada = true;
        }
function poner_en_venta(event,id_garaje){
    event.preventDefault()
    const DataFormulario = new FormData(event.target)
    let precio_venta =(DataFormulario.get("precio_venta"))

    const myModalEl = document.getElementById(`ventana_modal_vender_${id_garaje}`);
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

    let body
    body = {
        Nuevo_precio_venta: precio_venta,
        Id_garaje: id_garaje
        }
    fetch("http://localhost:5000/garaje/"+id,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)})
    .then((respuesta) => respuesta.json())
    .then(procesar_respuesta_poner_en_venta)
    .catch((error) => console.log("ERROR", error))
}
function procesar_respuesta_poner_en_venta(data) {
    if (data.success) {
        const boton_venta = document.getElementById(`boton_vender_${data.Id_garaje}`)
        boton_venta.setAttribute("hidden","")
        const boton_sacar_venta = document.getElementById(`boton_sacar_venta_${data.Id_garaje}`)
        boton_sacar_venta.removeAttribute("hidden")
    } 
    else {
        alert(data.message)
    }
}

function sacar_de_venta(id_garaje){
    let body
    body = {Id_garaje: id_garaje}
    fetch("http://localhost:5000/garaje_sacar_venta/"+id,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)})
    .then((respuesta) => respuesta.json())
    .then(procesar_respuesta_sacar_venta)
    .catch((error) => console.log("ERROR", error))

    function procesar_respuesta_sacar_venta(data) {
        if (data.success) {
            const boton_sacar_venta = document.getElementById(`boton_sacar_venta_${data.Id_garaje}`)
            boton_sacar_venta.setAttribute("hidden","")
            const boton_venta = document.getElementById(`boton_vender_${data.Id_garaje}`)
            boton_venta.removeAttribute("hidden")
        } 
        else {
            alert(data.message)
        }
    }
}


iniciar_data_table()