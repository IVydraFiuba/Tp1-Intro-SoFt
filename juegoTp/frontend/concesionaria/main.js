let parametros = window.location.search;
let id = new URLSearchParams(parametros).get("id")

let dia 
let plata
let nivel_tienda
let id_tienda 
let giros
var Autos_a_la_venta = []
let hora_actual
let plata_ganada = 0
let plata_gastada = 0
let nombre_usuario

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
                nombre_usuario = contenido.Nombre
                const contenedor_nombre = document.getElementById("Nombre_concesionaria")
                contenedor_nombre.innerText = contenido.Nombre_concesionaria
                const contenedor_plata = document.getElementById("Plata_usuario")
                contenedor_plata.innerText = plata
                const contenedor_dia = document.getElementById("Dia_usuario")
                contenedor_dia.innerText = dia
            }
function salir(){
    window.location.href = `../`;
}

function iniciar_dia(){
    const boton_iniciar = document.getElementById("boton_iniciar_dia")
    boton_iniciar.setAttribute("hidden","")
    const contenedor_tiempo = document.getElementById("tiempo")
    contenedor_tiempo.removeAttribute("hidden")
    const boton_tienda = document.getElementById("boton_tienda")
    iniciar_tienda()
    hora_actual = 8

    function actualizar_hora(){
        hora_actual+=1
        if (hora_actual == 20){
            clearInterval(intervalo)
            contenedor_tiempo.setAttribute("hidden","")
            const boton_pasar = document.getElementById("boton_pasar_dia")
            boton_pasar.removeAttribute("hidden")
            boton_tienda.setAttribute("disabled","")
            cargar_pasar_dia()
        }else{
            revisar_autos_a_la_venta()
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
    let intervalo = setInterval(actualizar_hora,8000)
}
function cargar_tienda(lista_autos){
    const contenedor_tienda = document.getElementById("contenedor_tienda")
    if (nivel_tienda == 1){
        const boton_mejorar_tienda = document.getElementById("boton_mejorar_tienda")
        boton_mejorar_tienda.setAttribute("disabled","")
    }
    let autos_tienda = mesclar_autos(lista_autos)
    contenedor_tienda.innerHTML = ""
    for (let index = 0; index < autos_tienda.length; index++) {
        contenedor_tienda.innerHTML += `
        <div class="col">
            <div class="card h-100">
                <img src="${autos_tienda[index].Imagen}" class="card-img-top" width="300" height="225">
                <div class="card-body align-text-bottom">
                    <h5 class="card-title">${autos_tienda[index].Marca} ${autos_tienda[index].Modelo}</h5>
                </div>
                <div class="card-footer">
                    <small class="text-body-secondary">${autos_tienda[index].Precio}$</small>
                    <button id="boton_${index}" onclick="comprar_auto(${autos_tienda[index].Id},${autos_tienda[index].Precio},${index})" type="button" class="btn btn-success" >Comprar</button>
                </div>
            </div>
        </div>
                `}
    contenedor_tienda.innerHTML +=`
    <button onclick='girar_tienda(${JSON.stringify(lista_autos)}, ${giros})' type="button" class="btn btn-outline-primary position-relative" style="margin-left: 380px">Giro
    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    ${giros}
    <span class="visually-hidden"></span>
    </span>
    </button>
    `
}
function mesclar_autos(lista_autos){
    const autos_tienda = []
    //Copio la lista de autos para no modificarla al eliminar los autos que ya se agregaron a autos_tienda
    const copia_lista_autos = lista_autos.slice()
    for (let i = 0; i < 3; i++) {
        //math.floor redondea el numero hacia abajo NO hacia arriba
        const index_aleatorio = Math.floor(Math.random() * copia_lista_autos.length)
        autos_tienda.push(copia_lista_autos[index_aleatorio])
        copia_lista_autos.splice(index_aleatorio, 1)
        }
    return autos_tienda}

function girar_tienda(lista_autos){
    if (giros > 0){
        giros -= 1
        let body
        body = {Giros_actualizados: giros}
        fetch(`http://localhost:5000/tienda/${id_tienda}/giros`,{
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

function comprar_auto(auto_id,precio,indice_boton){
    if (precio <= plata){
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
    }else{
        alert("No te alcanza la plata para comprarlo")
    }
}
function procesar_respuesta_comprar(data) {
    if (data.success) {
        const boton_compra = document.getElementById(`boton_${data.indice_boton}`)
        boton_compra.setAttribute("disabled","")
        const contenedor_plata = document.getElementById("Plata_usuario")
        plata_gastada -= data.Precio
        plata -= data.Precio
        contenedor_plata.innerText = data.Plata
        iniciar_data_table()
        cargar_pasar_dia()
        } 
    else {
        alert("Error al realizar la compra ")
    }
}

function mejorar_tienda(){
    if (!(nivel_tienda == 1)){
        let costo 
        if (nivel_tienda == 3){
            costo = 15000
        }else{
            costo = 40000
        }
        if (costo <= plata){
            nivel_tienda -= 1
            let body
            body = {Nivel_actualizado: nivel_tienda}
            fetch(`http://localhost:5000/tienda/${id_tienda}/nivel`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)})
            .then((respuesta) => respuesta.json())
            .then(procesar_respuesta_nivel)
            .catch((error) => console.log("ERROR", error))
        }else{
            alert("No te alcanza la plata para mejorar la tienda")
        }
        
        function procesar_respuesta_nivel(data){
            if (data.success) {
                const precio_mejora= document.getElementById("precio_mejora")
                const contenedor_plata = document.getElementById("Plata_usuario")
                if(nivel_tienda == 2){
                    precio_mejora.innerText = 40000
                    plata_gastada -= 15000
                    plata -= 15000
                    contenedor_plata.innerText = plata
                }else{
                    precio_mejora.innerText = "MAX"
                    const boton_mejorar_tienda = document.getElementById("boton_mejorar_tienda")
                    boton_mejorar_tienda.setAttribute("disabled","")
                    plata_gastada -= 40000
                    plata -= 40000
                    contenedor_plata.innerText = plata
                }
                cargar_pasar_dia()
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
            columnDefs:[{orderable:false,targets: [0,2,6,7]}],
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
            <tr id="fila_${contenido[index].Id_garaje}">
                <td><img src="${contenido[index].Imagen}" class="card-img-top" style="width:300px;height:auto;"></td>  
                <td>${contenido[index].Marca}</td>
                <td>${contenido[index].Modelo}</td>
                <td>${contenido[index].Año}</td>
                <td>${contenido[index].Nivel}</td>
                <td>${contenido[index].Precio} $</td>
                <td>
                    <button id="boton_ofertas_${contenido[index].Id_garaje}" disabled type="button" class="btn btn-outline-primary position-relative btn-lg" data-bs-toggle="modal" data-bs-target="#ventana_modal_ofertas_${contenido[index].Id_garaje}">Ofertas
                        <span id="notificacion_${contenido[index].Id_garaje}" class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle" hidden></span>
                    </button>
                    <div class="modal fade" id="ventana_modal_ofertas_${contenido[index].Id_garaje}" tabindex="-1" data-bs-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h2 class="modal-title">Chat de regateo</h2>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">  
                                    <div id="contenedor_ofertas_${contenido[index].Id_garaje}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>                         
                <td>
                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button hidden onclick="sacar_de_venta(${contenido[index].Id_garaje})" id="boton_sacar_venta_${contenido[index].Id_garaje}" type="button" class="btn btn-outline-danger btn-lg">Sacar de la venta</button>
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
                                                        <td><img src="${contenido[index].Imagen}" class="card-img-top" style="width:300px;height:auto;"></td>
                                                        <td>${contenido[index].Nivel}</td>
                                                        <td>${contenido[index].Precio} $</td>
                                                        <td>
                                                            <form onsubmit="poner_en_venta(event,${contenido[index].Id_garaje})">
                                                                <input type="text" class="form-control" name="precio_venta" placeholder="${contenido[index].Precio } $" required>
                                                                <button type="submit" class="btn btn-success mt-4">Presentar oferta</button>
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
            agregar_auto_a_la_venta(contenido[index].Id_garaje,contenido[index].Precio,contenido[index].Precio_venta)
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

    const myModalEl = document.getElementById(`ventana_modal_vender_${id_garaje}`)
    const modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide()

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
        agregar_auto_a_la_venta(data.Id_garaje,data.Precio,data.Precio_de_venta)
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
    fetch(`http://localhost:5000/garaje/${id}/sacar_venta`,{
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
            sacar_auto_a_la_venta(data.Id_garaje)
            const boton_oferta = document.getElementById(`boton_ofertas_${data.Id_garaje}`)
            boton_oferta.setAttribute("disabled","")
            const boton_sacar_venta = document.getElementById(`boton_sacar_venta_${data.Id_garaje}`)
            boton_sacar_venta.setAttribute("hidden","")
            const boton_venta = document.getElementById(`boton_vender_${data.Id_garaje}`)
            boton_venta.removeAttribute("hidden")
            const notificacion = document.getElementById(`notificacion_${data.Id_garaje}`)
            notificacion.setAttribute("hidden","")

        } 
        else {
            alert(data.message)
        }
    }
}
function agregar_auto_a_la_venta(id_garaje,precio,precio_de_venta){
    let auto_para_vender = {
        Id_garaje: id_garaje,
        Precio: precio,
        Precio_de_venta: precio_de_venta,
        Ofertado: false
    }
    Autos_a_la_venta.push(auto_para_vender)
}
function sacar_auto_a_la_venta(id_garaje){
    for (let i = 0; i < Autos_a_la_venta.length; i++) {
        if (Autos_a_la_venta[i].Id_garaje === id_garaje) {
            Autos_a_la_venta.splice(i, 1)
            i--
        }
    }
}
function revisar_autos_a_la_venta(){
    for (let index = 0; index < Autos_a_la_venta.length; index++) {
        var ofertado = Autos_a_la_venta[index].Ofertado
        if (!ofertado){
            const id_garaje = Autos_a_la_venta[index].Id_garaje
            const precio_mercado = Autos_a_la_venta[index].Precio
            const precio_venta = Autos_a_la_venta[index].Precio_de_venta
            // Esta logica no tiene en cuenta si el jugador logra pasar los 40 dia,la uso por un tema de simplicidad en el trabajo practico
            let margen_de_compra_diario = 0.30 - (dia * 0.01)
            let porcentaje_de_compra = precio_mercado * margen_de_compra_diario
            let cota_superior = precio_mercado + porcentaje_de_compra
            
            let precio
            let mensaje
            const boton_oferta = document.getElementById(`boton_ofertas_${id_garaje}`)
            const notificacion = document.getElementById(`notificacion_${id_garaje}`)
            if (precio_mercado <= precio_venta && precio_venta <= cota_superior){
                let probabilidad_de_oferta = 0.5 - (dia * 0.001)
                const numero_random = Math.random() 
                if (numero_random < probabilidad_de_oferta) {
                    boton_oferta.removeAttribute("disabled")
                    if (notificacion) {notificacion.removeAttribute("hidden")}                
                    [precio,mensaje] = decidir_precio(precio_mercado,precio_venta,precio)
                    Autos_a_la_venta[index].Ofertado = true
                    agregar_oferta(id_garaje,mensaje,precio,precio_mercado)
                }
            }else if(precio_mercado > precio_venta){
                boton_oferta.removeAttribute("disabled")
                if (notificacion) {notificacion.removeAttribute("hidden")}                
                precio = precio_venta
                mensaje = `Me parece un buen trato me lo llevare por ${precio}$`
                Autos_a_la_venta[index].Ofertado = true
                agregar_oferta(id_garaje,mensaje,precio,precio_mercado)
            }else{
                let probabilidad_de_oferta = 0.1 
                const numero_random = Math.random() 
                if (numero_random < probabilidad_de_oferta) {
                    boton_oferta.removeAttribute("disabled")
                    if (notificacion) {notificacion.removeAttribute("hidden")}                
                    precio = precio_mercado - (precio_mercado * 0.1)
                    mensaje = `Ese precio es demasiado,te ofresco ${precio} por el`
                    Autos_a_la_venta[index].Ofertado = true
                    agregar_oferta(id_garaje,mensaje,precio,precio_mercado)
                }
            }
        }
    }
}
function decidir_precio(precio_mercado,precio_de_venta,precio,mensaje){
    let probabilidad_de_aceptar = 0.4 - (dia * 0.01)
    const numero_random = Math.random() 
    if (numero_random < probabilidad_de_aceptar) {
        precio = precio_de_venta
        mensaje = `Me parece un buen trato me lo llevare por ${precio}$`
    }else{
        precio_de_venta = 
        precio = (precio_de_venta - (precio_de_venta - precio_mercado) * numero_random)
        mensaje = `Te puedo ofrecer ${Math.round(precio / 100)*100} $ por el auto` 
    }
    return [Math.round(precio / 100)*100,mensaje]
}
function agregar_oferta(id_garaje,mensaje,precio,precio_mercado){
let hora
if(hora_actual > 12){
    hora =`${hora_actual - 12}:00 PM`
}else{
    hora =`${hora_actual}:00 AM`
}
let contenedor_ofertas = document.getElementById(`contenedor_ofertas_${id_garaje}`)
contenedor_ofertas.innerHTML =`
<div class="card-body data-mdb-perfect-scrollbar-init" style="position: relative; height: 400px overflow-y: auto">
<div id="contenedor_mensajes_ofertas_${id_garaje}">
    <div class="d-flex justify-content-between">
        <p class="small mb-1">Timona Siera</p>
        <p class="small mb-1 text-muted">Dia ${dia} ${hora} </p>
    </div>
    <div class="d-flex flex-row justify-content-start">
        <img src="imagenes/avatar_1.webp"
        alt="avatar 1" style="width: 90px; height: 100%;">
        <div>
            <p class=" h3 p-2 ms-3 mb-3 rounded-3 bg-body-tertiary" >${mensaje}</p>
        </div>
    </div>
</div>
</div>
<div class="card-footer text-muted d-flex justify-content-start align-items-center p-3">
    <div class="input-group mb-0" id="contenedor_mensajes_botones_${id_garaje}">
        <button data-mdb-button-init data-mdb-ripple-init class="btn btn-danger" type="button" onclick="no_vender(${id_garaje})"  style="padding-top: .55rem;">No vender</button>
        <input type="number" class="form-control" id="precio_regate_${id_garaje}" value="${precio}"/>
        <button data-mdb-button-init data-mdb-ripple-init class="btn btn-warning" type="button" onclick="negociar(${id_garaje},${precio},${precio_mercado})">Negociar</button>
        <button onclick="vender(${id_garaje},${precio})" data-mdb-button-init data-mdb-ripple-init class="btn btn-success" type="button" style="padding-top: .55rem;">Vender</button>
    </div>
</div>`
}
function no_vender(id_garaje){
    const modal = document.getElementById(`ventana_modal_ofertas_${id_garaje}`)
    const modal_instancia = bootstrap.Modal.getInstance(modal)
    if (modal && modal.classList.contains('show')) {modal_instancia.hide()}
    for (let index = 0; index < Autos_a_la_venta.length; index++) {
        if (Autos_a_la_venta[index].Id_garaje == id_garaje)
            Autos_a_la_venta[index].Ofertado = false
    }
    const notificacion = document.getElementById(`notificacion_${id_garaje}`)
    if (notificacion) {notificacion.setAttribute("hidden","")}
    const boton_oferta = document.getElementById(`boton_ofertas_${id_garaje}`)
    boton_oferta.setAttribute("disabled","")
}
function negociar(id_garaje,precio_anterior,precio_mercado){
    let precio_regate = document.getElementById(`precio_regate_${id_garaje}`).value
    let hora
        if(hora_actual > 12){
            hora =`${hora_actual - 12}:00 PM`
        }else{
            hora =`${hora_actual}:00 AM`
        }
    const chat_ofertas = document.getElementById(`contenedor_mensajes_ofertas_${id_garaje}`)
    chat_ofertas.innerHTML+=`
        <div class="d-flex justify-content-between">
            <p class="small mb-1 text-muted">Dia ${dia} ${hora} </p>
            <p class="small mb-1">${nombre_usuario}</p>
        </div>
        <div class="d-flex flex-row justify-content-end">
            <div>
                <p class="h3 p-2 me-3 mb-3 text-white rounded-3 bg-warning">Te lo puedo dejar por ${precio_regate} $</p>
            </div>
            <img src="imagenes/avatar_2.webp" style="width: 90px; height: 100%;">
        </div>
    `
    let cota_superior = precio_anterior + (precio_mercado * (0.10 - (dia * 0.003)))
    let mensaje
    let precio
    if (precio_mercado <= precio_regate && precio_regate <= cota_superior){
        [precio,mensaje] = decidir_precio(precio_mercado,precio_regate,precio)
        agregar_mensaje_regateo(mensaje,id_garaje,precio,precio_mercado)
    }else if(precio_mercado > precio_regate){
        precio = precio_regate
        mensaje = `Me parece un buen trato me lo llevare por ${precio}$`
        agregar_mensaje_regateo(mensaje,id_garaje,precio,precio_mercado)
    }else{
        mensaje = "El auto no vale tanto,no me intentes estafar"
        precio = precio_mercado
        agregar_mensaje_regateo(mensaje,id_garaje,precio,precio_mercado)
    }
}
function agregar_mensaje_regateo(mensaje,id_garaje,precio,precio_mercado){
    let hora
    if(hora_actual > 12){
        hora =`${hora_actual - 12}:00 PM`
    }else{
        hora =`${hora_actual}:00 AM`
    }
    const chat_ofertas = document.getElementById(`contenedor_mensajes_ofertas_${id_garaje}`)
    chat_ofertas.innerHTML+=`
            <div class="d-flex justify-content-between">
                <p class="small mb-1">Timona Siera</p>
                <p class="small mb-1 text-muted">Dia ${dia} ${hora} </p>
            </div>
            <div class="d-flex flex-row justify-content-start">
                <img src="imagenes/avatar_1.webp"style="width: 90px; height: 100%;">
                <div>
                    <p class=" h3 p-2 ms-3 mb-3 rounded-3 bg-body-tertiary" >${mensaje}</p>
                </div>
            </div>
            <div class="card-footer text-muted d-flex justify-content-start align-items-center p-3">
        </div>
    `
    const contenedor_mensajes_botones = document.getElementById(`contenedor_mensajes_botones_${id_garaje}`)
    contenedor_mensajes_botones.innerHTML=`
    <button data-mdb-button-init data-mdb-ripple-init class="btn btn-danger" type="button" onclick="no_vender(${id_garaje})"  style="padding-top: .55rem;">No vender</button>    <input type="number" class="form-control" id="precio_regate_${id_garaje}" value="${precio}"/>
    <button data-mdb-button-init data-mdb-ripple-init class="btn btn-warning" type="button" onclick="negociar(${id_garaje},${precio},${precio_mercado})">Negociar</button>
    <button onclick="vender(${id_garaje},${precio})" data-mdb-button-init data-mdb-ripple-init class="btn btn-success" type="button" style="padding-top: .55rem;">Vender</button>
    `
}
    function vender(id_garaje,precio){
    let body
    body = {Ganancia: precio}
    fetch(`http://localhost:5000/garaje/${id_garaje}/vender`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)})
    .then((respuesta) => respuesta.json())
    .then(procesar_respuesta_vender)
    .catch((error) => console.log("ERROR", error))
    }   
    function procesar_respuesta_vender(data){
        if (data.success){
            const contenedor_plata = document.getElementById("Plata_usuario")
            contenedor_plata.innerText = data.Plata
            plata_ganada += data.Ganancia
            plata += data.Ganancia

            const modal = document.getElementById(`ventana_modal_ofertas_${data.Id_garaje}`)
            const modal_instancia = bootstrap.Modal.getInstance(modal)
            if (modal && modal.classList.contains('show')) {
                modal_instancia.hide()}
            const notificacion = document.getElementById(`notificacion_${data.Id_garaje}`)
            notificacion.setAttribute("hidden","")
            sacar_auto_a_la_venta(data.Id_garaje)

            const fila_id = `#fila_${data.Id_garaje}`
            dataTable.row(fila_id).remove().draw(false)
            cargar_pasar_dia()
        }else{
            alert("No se pudo vender")
        }
    }

function cargar_pasar_dia(){
    const contenedor_pasar_dia = document.getElementById("contenedor_pasar_dia")
    contenedor_pasar_dia.innerHTML=`
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1 text-success">Plata generada:</h5>
                <p class="text-success">${plata_ganada}$</p>
            </div>
            <div class="d-flex w-100 justify-content-between" id="plata_gastada">
                <h5 class="mb-1 text-danger">Plata gastada:</h5>
                <p class="text-danger">${plata_gastada}$</p>
            </div>
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">Resumen:</h5>
                <p id="resumen">${plata_gastada + plata_ganada}$</p>
            </div>
            <div class="d-flex flex-row-reverse">
                <button type="button" class="btn btn-outline-primary" onclick="terminar_dia()">Terminar dia</button>
            </div>
    `
    const texto_resumen = document.getElementById("resumen")
    if (plata_ganada > (plata_gastada * -1)){
        texto_resumen.setAttribute("class","text-success")
    }else if(plata_ganada < (plata_gastada * -1)){
        texto_resumen.setAttribute("class","text-danger")
    }
}

function terminar_dia(){
    fetch(`http://localhost:5000/usuarios/${id}/terminar_dia/${dia}`,{method: "PUT"})
            .then((respuesta) => respuesta.json())
            .then(cargar_terminar_dia)
            .catch((error) => console.log("ERROR", error))
    function cargar_terminar_dia(data){
        if (data.success){
            location.reload()
        }else{
            alert("No se pudo terminar el dia")
        }
    }
}

iniciar_data_table()