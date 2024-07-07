fetch("http://localhost:5000/usuarios")
            .then((respuesta) => respuesta.json())
            .then(cargar_datos)
            .catch((error) => console.log("ERROR", error))
function cargar_datos(contenido){
    const tabla_usuarios = document.getElementById("elegir_usuarios")

    for (let index = 0; index < contenido.length; index++) {
        const item = document.createElement("a");
        item.setAttribute("class", "list-group-item list-group-item-action");
        item.setAttribute("href", `/concesionaria?id=${contenido[index].Id}`);
        item.setAttribute("aria-current", "true");

        const contenedor1 = document.createElement("div");
        contenedor1.setAttribute("class", "d-flex w-100 justify-content-between");

        const nombre_usuario = document.createElement("h5");
        nombre_usuario.setAttribute("class", "mb-1");
        nombre_usuario.textContent = contenido[index].Nombre
        contenedor1.append(nombre_usuario)

        const contenedor2 = document.createElement("div");
        contenedor2.setAttribute("class", "d-flex w-100 justify-content-between");
        const nombre_concesionaria = document.createElement("h5");
        nombre_concesionaria.setAttribute("class", "mb-1");
        nombre_concesionaria.textContent = contenido[index].Concesionaria.Nombre
        const plata = document.createElement("p");
        plata.textContent = `Plata - ${contenido[index].Plata}$`

        contenedor2.append(nombre_concesionaria)
        contenedor2.append(plata)

        item.append(contenedor1)
        item.append(contenedor2)

        tabla_usuarios.append(item)
    }
}

function cargar_nuevo_personaje(event){
    event.preventDefault()
    const DataFormulario = new FormData(event.target)
    
    const Nom_usuario = DataFormulario.get("nom_usuario")
    const Nom_concesionaria = DataFormulario.get("nom_concesionaria")
    
    fetch("http://localhost:5000/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nom_usuario: Nom_usuario,
            nom_concesionaria: Nom_concesionaria,
        })
    })
    .then((respuesta) => respuesta.json())
    .then(procesar_respuesta)
    .catch((error) => console.log("ERROR", error))
}
function procesar_respuesta(data) {
    if (data.success) {
        let respuesta = confirm("Quires empezar la partida con el?")
        if (respuesta) {
            alert("Iniciando...")
        }
        else {
            location.reload();
        }
    } 
    else {
        alert("Error al crear el personaje ")
    }
}