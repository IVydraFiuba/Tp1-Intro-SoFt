fetch("http://localhost:5000/usuarios")
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))
function cargar_datos(contenido){
    if (contenido.length == 0){
        const boton_jugar = document.getElementById("boton_jugar")
        boton_jugar.setAttribute("disabled","")
    }
    else{
        const tabla_usuarios = document.getElementById("elegir_usuarios")
        for (let index = 0; index < contenido.length; index++) {
            const item = document.createElement("a");
            item.setAttribute("class", "list-group-item list-group-item-action");
            item.setAttribute("href", `/concesionaria?id=${contenido[index].Id}`);
            item.setAttribute("aria-current", "true");
            item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${contenido[index].Nombre}</h5>
                <p>"Dia - ${contenido[index].Dia}"</p>
            </div>
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${contenido[index].Concesionaria.Nombre}</h5>
                <p>"Plata - ${contenido[index].Plata} $"</p>
            </div>
            `
            tabla_usuarios.append(item)
            }
    }
}

const check_boton = document.getElementById('check_boton')
check_boton.addEventListener('change', mostrar_campos)
function mostrar_campos() {
    const campos = document.getElementById('campos_extra');
    if (check_boton.checked) {
        campos.style.display = 'block'; 
    } else {
        campos.style.display = 'none'; 
    }}

function cargar_nuevo_personaje(event){
    event.preventDefault()
    const DataFormulario = new FormData(event.target)

    const check_boton = document.getElementById('check_boton')
    //SI no declaro el body fuera no lo puedo mandar al fetch 
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
    .then(procesar_respuesta)
    .catch((error) => console.log("ERROR", error))
    }

function procesar_respuesta(data) {
    if (data.success) {
        let respuesta = confirm("Quires empezar la partida con el?")
        if (respuesta) {
            // tengo que ver que devuelve DATA
            // window.location.href = `/concesionaria?id=${contenido[index].Id}`;
        }
        else {
            location.reload();
        }
    } 
    else {
        alert("Error al crear el personaje ")
    }
}