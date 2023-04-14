const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacion = document.querySelector('#paginacion');

const resgistroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

//Cuando se cargue todo el documento y se hace el llamado con el submit
window.onload = () => {
    formulario.addEventListener('submit', validadrFormulario);
}

function validadrFormulario(e) {
    e.preventDefault();

    

    if( termino === '') {
        mostrarAlerta('Agregue un termino de busqueda');
        return;
    }

    buscarImagen();
}

//Alerta si no escribe nada el usuario
function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta) {

        const alerta = document.createElement('P');
        alerta.classList.add('bg-red-100', 'text-center', 'border-red-400', 'text-red-700','px-4', 'py-4', 'py-3', 'max-w-lg', 'mx-auto', 'mt-6', 'rounded');
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
   
}

//funcion que se le da el termino de busqueda y realiza un fetch con el url de la api
async function buscarImagen() {

    const termino = document.querySelector('#termino').value;

    const key = '33462421-103c2a8b47d8801cd3210b43c';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${resgistroPorPagina}&page=${paginaActual}`;

    // fetch(url)
    //     .then( respuesta => respuesta.json())
    //     .then( resultado => {
    //         totalPaginas = calcularPaginas(resultado.totalHits);
    //         mostrarImagenes(resultado.hits);
    //     });

    
        try {
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);


        } catch (error) {
            console.log(error);
        }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / resgistroPorPagina));
}

//Se muestra las imagenes que se obtienen de la funcion buscarImagen()
function mostrarImagenes(imagenes){
    
    limpiarHTML(resultado);
   
    imagenes.forEach( imagen => {
        const { id, previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    
                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="font-bold"> ${views} <span class="font-light">Veces Vista</span></p>

                        <a class="block  w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold rounded mt-5 p-1 text-center"
                        href="${largeImageURL}" target="_blank" rel="noopener no referrer">
                        Ver imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    imprimirPaginador();
}

//El generador permite iterar sobre los registros y te dice cuando termino
function *crearPaginador(total){
    console.log(total)
    for(let i = 1; i <= total; i++) {
        yield i;
    }
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    limpiarHTML(paginacion);

    while(true) {
        const { value, done } = iterador.next();

        if( done ) return;

        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagen();
        }
        paginacion.appendChild(boton);
    }
}

function limpiarHTML(selector){

     //Limpiar los resultados previos 
     while(selector.firstChild){
        selector.removeChild(selector.firstChild);
    }
}

 