document.addEventListener("DOMContentLoaded", iniciarApp);

function iniciarApp(){

    const input = document.getElementById("tarea");
    const btnAgregar = document.getElementById("btnAgregar");
    const lista = document.querySelector("ul");
    const filtroFecha = document.getElementById("filtroFecha");
    const btnFiltrar = document.getElementById("btnFiltrar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    let fecha=document.getElementById("fechaTarea");

    btnAgregar.addEventListener("click", agregarTarea);
    btnFiltrar.addEventListener("click", filtrarTareas);
    btnLimpiar.addEventListener("click", limpiarFiltro);

    lista.addEventListener("click", manejarClickLista);
    lista.addEventListener("change", manejarCheckbox);

    cargarTareas();
    contarTareas();


    function cargarTareas(){

        lista.innerHTML="";

        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
        const fechaFiltro=filtroFecha.value;

        let tareasMostrar =fechaFiltro ? tareas.filter(t => t.fecha === fechaFiltro) : tareas;  
        tareasMostrar.sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
        tareasMostrar.forEach(tarea => crearElementoTarea(tarea));
    }


    function agregarTarea(){

        const texto = input.value.trim();
        const fechaValor = fecha.value;

        if(texto === "" || fechaValor === ""){
            alert("Ingrese una tarea y una fecha");
            return;
        }
        

        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

        const nuevoId = tareas.length > 0 ? tareas[tareas.length-1].id + 1 : 1;

        const nuevaTarea = {
            id:nuevoId,
            texto:texto,
            completada:false,
            fecha: fechaValor
        };

        tareas.push(nuevaTarea);

        localStorage.setItem("tareas", JSON.stringify(tareas));

        cargarTareas();

        input.value="";
        fecha.value="";

        contarTareas();
    }


    function crearElementoTarea(tarea){

        const li = document.createElement("li");

        li.dataset.id = tarea.id;

        const checkbox = document.createElement("input");
        checkbox.type="checkbox";
        checkbox.checked = tarea.completada;

        const span = document.createElement("span");
        span.textContent = tarea.texto;

        const fechaSpan=document.createElement("span");
        fechaSpan.classList.add("fecha");
        fechaSpan.textContent = tarea.fecha;
        

        if(tarea.completada){
            span.classList.add("completada");
        }

        const btnEditar = document.createElement("button");
        btnEditar.textContent="Editar";
        btnEditar.classList.add("editar");

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent="Eliminar";
        btnEliminar.classList.add("eliminar");

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(fechaSpan);
        li.appendChild(btnEditar);
        li.appendChild(btnEliminar);

        lista.appendChild(li);
    }


    function manejarCheckbox(e){

        if(e.target.type === "checkbox"){

            const li = e.target.closest("li");
            const id = Number(li.dataset.id);

            const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

            const tarea = tareas.find(t => t.id === id);

            tarea.completada = e.target.checked;

            localStorage.setItem("tareas", JSON.stringify(tareas));

            const span = li.querySelector("span");

            span.classList.toggle("completada", e.target.checked);
        }
    }


    function manejarClickLista(e){

        const li = e.target.closest("li");

        if(!li) return;

        const id = Number(li.dataset.id);

        if(e.target.classList.contains("eliminar")){
            eliminarTarea(id);
        }

        if(e.target.classList.contains("editar")){
            editarTarea(id);
        }
    }


    function eliminarTarea(id){

        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

        const nuevas = tareas.filter(t => t.id !== id);

        localStorage.setItem("tareas", JSON.stringify(nuevas));

        cargarTareas();
        contarTareas();
    }


    function editarTarea(id){

        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

        const tarea = tareas.find(t => t.id === id);

        const nuevoTexto = prompt("Editar tarea:", tarea.texto);

        if(nuevoTexto && nuevoTexto.trim() !== ""){

            tarea.texto = nuevoTexto.trim();

            localStorage.setItem("tareas", JSON.stringify(tareas));

            cargarTareas();
        }
    }

    function filtrarTareas(){

        
        
        const fechaFiltro = filtroFecha.value;
        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
        
        const filtradas = tareas.filter(t => t.fecha === fechaFiltro);
        if(filtradas.length === 0){
            alert("No se encontraron tareas para esa fecha");
            return;
        }
        lista.innerHTML="";
        filtradas.forEach(tarea => crearElementoTarea(tarea));
        contarTareas();
    }

    function limpiarFiltro(){
        filtroFecha.value="";
        cargarTareas();
        contarTareas();
    }

    function contarTareas(){
        const fechaFiltro = filtroFecha.value;
        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
        const filtradas = fechaFiltro ? tareas.filter(t => t.fecha === fechaFiltro) : tareas;
        const completas=filtradas.filter(t => t.completada).length;
        const pendientes=filtradas.filter(t => !t.completada).length;
        const contador = document.getElementById("contador");
        contador.textContent=`Total: ${filtradas.length} - Completas: ${completas} - Pendientes: ${pendientes}`;
    

    }



}