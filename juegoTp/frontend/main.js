fetch("http://localhost:5000/usuarios")
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))

function cargar_datos(contenido){
    const boton_jugar = document.getElementById("boton_jugar")
    const modal = document.getElementById("ventana_modal_jugar")
    const modal_instancia = bootstrap.Modal.getInstance(modal)
    if (!(contenido.success)){
        if (modal.classList.contains('show')) {
            modal_instancia.hide()}
        boton_jugar.setAttribute("disabled","")
    }
    else{
        boton_jugar.removeAttribute("disabled")
        const tabla_usuarios = document.getElementById("elegir_usuarios")
        tabla_usuarios.innerHTML = ``
        let usuarios = contenido.usuarios
        for (let index = 0; index < usuarios.length; index++) {
            const item = document.createElement("a");
            item.setAttribute("class", "list-group-item list-group-item-action");
            item.setAttribute("href", `/concesionaria?id=${usuarios[index].Id}`);
            item.setAttribute("aria-current", "true");
            item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${usuarios[index].Nombre}</h5>
                <p>"Dia - ${usuarios[index].Dia}"</p>
            </div>
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${usuarios[index].Nombre_concesionaria}</h5>
                <p>"Plata - ${usuarios[index].Plata} $"</p>
            </div>
            `
            tabla_usuarios.append(item)
            tabla_usuarios.innerHTML+=`
            <div class="d-flex flex-row justify-content-end">
                <button type="button" class="btn btn-outline-danger me-3 mt-2 mb-2" onclick="eliminar_usuario(${usuarios[index].Id})">Eliminar</button>
                <button class="btn btn-outline-light me-3 mt-2 mb-2" data-bs-toggle="modal" data-bs-target="#ventana_modal_editar_${usuarios[index].Id}">Editar</button>
            </div>
            `
            const contenedor_padre = document.getElementById("contenedor_padre")
            const modal = document.createElement("div")
            modal.classList.add("modal", "fade")
            modal.id = `ventana_modal_editar_${usuarios[index].Id}`
            modal.setAttribute("data-bs-backdrop", "static")
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title">Editando...</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onsubmit="editar_usuario(event,${usuarios[index].Id})">
                                <div class="mb-3">
                                    <label for="nom_nuevo" class="form-label">Nombre del personaje</label>
                                    <input placeholder="${usuarios[index].Nombre}" type="text" class="form-control" name="nom_nuevo" required>
                                </div>
                                <div class="mb-3">
                                    <label for="nom_nuevo_concesionaria" class="form-label">Nombre de la concesionaria</label>
                                    <input placeholder="${usuarios[index].Nombre_concesionaria}" type="text" class="form-control" name="nom_nuevo_concesionaria"  required>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-success">Cargar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `
            contenedor_padre.appendChild(modal)
            }
    }
}

const check_boton = document.getElementById('check_boton')
check_boton.addEventListener('change', mostrar_campos)
function mostrar_campos() {
    const campos = document.getElementById('campos_extra')
    if (check_boton.checked) {
        campos.style.display = 'block' 
    } else {
        campos.style.display = 'none' 
    }}

function crear_usuario(event){
    event.preventDefault()
    const DataFormulario = new FormData(event.target)

    const check_boton = document.getElementById('check_boton')
    let body
    if (check_boton.checked){
        const Nom_usuario = DataFormulario.get("nom_usuario")
        const Nom_concesionaria = DataFormulario.get("nom_concesionaria")
        const Plata = DataFormulario.get("plata")
        const Dia = DataFormulario.get("dia")
        const Giros = DataFormulario.get("giros")
        const Nivel_concesionaria = DataFormulario.get("nivel_tienda")
        body = {
            nom_usuario: Nom_usuario,
            nom_concesionaria: Nom_concesionaria,
            plata : Plata,
            dia : Dia,
            giros: Giros,
            nivel_concesionaria : Nivel_concesionaria
            }
        } 
    else {
        const Nom_usuario = DataFormulario.get("nom_usuario")
        const Nom_concesionaria = DataFormulario.get("nom_concesionaria")
        body = {
            nom_usuario: Nom_usuario,
            nom_concesionaria: Nom_concesionaria
            }
        }
    fetch("http://localhost:5000/usuarios",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)})
    .then((respuesta) => respuesta.json())
    .then(procesar_respuesta_crear)
    .catch((error) => console.log("ERROR", error))
    }

function procesar_respuesta_crear(data) {
    if (data.success) {
        let respuesta = confirm("Queres empezar la partida con el?")
        if (respuesta) {
            window.location.href = `/concesionaria?id=${data.Id_usuario}`
        }
        else {
            fetch("http://localhost:5000/usuarios")
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))
            const modal = document.getElementById("ventana_modal_crear")
            const modal_instancia = bootstrap.Modal.getInstance(modal)
            modal_instancia.hide()
        }
    } 
    else {
        alert("Error al crear el personaje ")
    }
}
function eliminar_usuario(id_usuario){
    let respuesta = confirm(`Esta seguro que quiere eliminar el usuario?`)
    if (respuesta){
        fetch("http://localhost:5000/usuarios/"+id_usuario,{method: "DELETE"})
        .then((respuesta) => respuesta.json())
        .then(procesar_respuesta_eliminar)
        .catch((error) => console.log("ERROR", error))
    }
}
function procesar_respuesta_eliminar(data) {
    if (data.success) {
        fetch("http://localhost:5000/usuarios")
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))
    } 
    else {
        alert(data.message)
    }
}

function editar_usuario(event,id_usuario){
    event.preventDefault()
    const DataFormulario = new FormData(event.target)

    const Nom_usuario = DataFormulario.get("nom_nuevo")
    const Nom_concesionaria = DataFormulario.get("nom_nuevo_concesionaria")
    let body
        body = {
            nom_nuevo: Nom_usuario,
            nom_nuevo_concesionaria: Nom_concesionaria
            }
        fetch("http://localhost:5000/usuarios/"+id_usuario,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)})
        .then((respuesta) => respuesta.json())
        .then(procesar_respuesta_editar)
        .catch((error) => console.log("ERROR", error))
        }
    function procesar_respuesta_editar(data) {
        if (data.success) {
            const modal = document.getElementById(`ventana_modal_editar_${data.Id_usuario}`)
            const modal_instancia = bootstrap.Modal.getInstance(modal)
            if (modal.classList.contains('show')) {
                modal_instancia.hide()}
            fetch("http://localhost:5000/usuarios")
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))
        } 
        else {
            alert(data.message)
        }
}