
// ------------ consumo de la api
const buscar = document.querySelector('#buscar') // input buscar
const nombre = document.querySelector('#nombre') // h3 titulo del pokemon
const modalname = document.querySelector('#modal-name') // nombre en el modal
const imagen = document.querySelector('.img-pokemon') // img del pokemon
const imgModal = document.querySelector('#imgModal') // img del pokemon
const evoluciones = document.querySelectorAll('.evolucion-pokemon img')


//----- evoluciones I, II, III
const g1 = document.getElementById('g1') 
const g2 = document.getElementById('g2')
const g3 = document.getElementById('g3')

// creacion de un evneto de tipo entrada
// este evento tomara el valor ingresado en el buscador 
buscar.addEventListener('input',(e) =>{ // asignacion del evento al buscador 
    const datobuscado = e.target.value // constante que almacenara el valor ingresado 
    nombre.textContent = ('Buscando ...') // mostra buscar .. cada ves que se ingrese algo en el input 
    consultarAPI(datobuscado) // mandamos el valor ingresado a la funcion consultarApi
    infoPokemon(datobuscado)// mandamos el valor ingresado a la funcion infoPokemon
})

// funcion que consultara la API de pokeApi segun el valor que mandamos en buscar 
const consultarAPI = async (datobuscado) => {
    //consultamos en la api el nombre ingresado 
    const url = `https://pokeapi.co/api/v2/pokemon/${datobuscado}`
    try {
        // uso de fech para establecer la comunicaicon hacia la api 
        const respuesta = await fetch(url)
        // indicamos que queremos la informacion en tipo json
        const resultado = await respuesta.json()
        // verificamos la informacion 
        console.log(resultado)

        // Primera Ruta en base a la documentacion
        const urlEspecies = resultado.species.url //alacenamos la ruta hacia de la specie pokemon
        // console.log(urlEspecies)
        //mandamos la ruta hacia la funcion obtener evoluciones 
        obtenerEvoluciones(urlEspecies)
        // mandamos la info obtenida de la api para mostra datos espesificos del pokemon
        listarPokemon(resultado)
    } catch (error) {
        // validamos errores 
        // si no obtenemos nada definimos estos valores 
        nombre.textContent = 'Pokemon'
        imagen.src = './img/pokeball.png'
        imgModal.src = './img/pokeball.png'
        modalname.textContent = 'Pokemon'
        //evolucion.src = './img/evolucion.svg.png'

        // le asignamos a los nuestras etiquetas img una imagen en espesifico
        evoluciones.forEach(evolucion => evolucion.src = './img/evolucion.png' )
        // console.log(evoluciones)     
    }
}

// funcion para obtener las evoluciones del pokemon buscado
const obtenerEvoluciones = async(url) =>{
    try {
        // validamos conexion
        const respuestaEspecies = await fetch(url)
        // datos en tipo json
        const resultadoEspecies = await respuestaEspecies.json()

        //segunda ruta segun la documentacion 
        // accedemos a la ruta en la que estan las evoluciones pokemon
        const urlEvoluciones = resultadoEspecies.evolution_chain.url
        // console.log(urlEvoluciones)

        //consultando al mismo timpo la tercera ruta Evoluciones
        // validamos la conexion hacia la tercera ruta enviada por urlEvoluciones
        const respuestaEvoluciones = await fetch(urlEvoluciones)
        const resultadoEvoluciones = await respuestaEvoluciones.json()
        // validamos si es correcto la informacion 
         console.log(resultadoEvoluciones.chain)
        
        // mandamos la lista de las evoluciones y accedemos a esa informacion
        listarEvoluciones(resultadoEvoluciones.chain) 
    } catch (error) {
        console.log('Error al establecer la conexion hacia la ruta evoluciones')

    }
}


consultarAPI();

// funcion para mostra la informacion de la primera ruta obtenida 
const listarPokemon = (pokemon) =>{
    //obtenemos la informacion del pokemon segun la consulta establecida al consultarAPI    
    nombre.textContent = pokemon.name;//obtenemos el nombre 
    imagen.src  = pokemon.sprites.other["official-artwork"].front_default;//mostramos la imagen del pokemon buscado
}
const evolucionesPokemon = []//array que almacenara las evoluciones
//funcion que buscara y listara las evoluciones del pokemon
//Pokemons tiene la ruta de las evoluciones del pokemon buscado 
const listarEvoluciones = async (pokemons) =>{ 
    // limpiamos el array para que se agregen las nuevas evoluciones de otro pokemon a buscar 
    evolucionesPokemon.length = 0;
    let array = pokemons; //variable que tiene la ruta de las evolucinoes 
    // ciclo que recorrera todo el array
     while(array){
       //obtenemos el nombre de la primera Evolucion
        const nombres = array.species.name
        //mandamos el nombre de la evolucion a consultarPokemon para obtener la url de la img
        consultarPokemon(nombres)
        //almacenamos el nombre del pokemon
         evolucionesPokemon.push(nombres)
        // asignamos una nueva ruta dentro del arreglo 
         array = array.evolves_to[0]
    }
    

    // const evo = pokemons.evolves_to.map(level => level.species.name)    
     console.log('evoluciones', evolucionesPokemon)
}


let arrayimg = []

console.log(arrayimg)
// obtener imagen de la evolucion 
const consultarPokemon = async (consulPok) =>{
    // reiniciamos el array de las imagenes para obtener los nuevos valores
    arrayimg = [];
    const urlPokemon = `https://pokeapi.co/api/v2/pokemon/${consulPok}`
    const respuestaDataEvo = await fetch(urlPokemon);
    const resultadoDataEvo = await respuestaDataEvo.json();  


    
    let obtenerimg = resultadoDataEvo.sprites.other["official-artwork"].front_default;
    arrayimg.push(obtenerimg)  
    
    mostrarImagenes();
}

const mostrarImagenes = () =>{

    if (arrayimg.length > 0) g1.src = arrayimg[0]; // Asignar la primera imagen
    if (evolucionesPokemon.length > 0) g1.alt = evolucionesPokemon[0];//asignamos nombre
    if (arrayimg.length > 1) g2.src = arrayimg[1]; 
    if (evolucionesPokemon.length > 1) g2.alt = evolucionesPokemon[1];
    if (arrayimg.length > 2) g3.src = arrayimg[2];
    if (evolucionesPokemon.length > 2) g3.alt = evolucionesPokemon[2];
}

// proceso para asginar eventos a las imagenes y luego buscar el pokemon segun la evolucion seleccionado 
const eventoClick = () =>{
    // accedemos a cada elemento que contiene evoluciones
    // estos ellementos pueden ser img, a, p, etc
    evoluciones.forEach((img) =>{ 
        // a cada elemento de evoluciones le asignamos un evento click
        img.addEventListener('click', () => {
            const pokemonNombre = img.alt; // tomamos el valor alt de la imagen
            // segun la imagen seleccionado llamamos a la funcion infoPokemon
            if(pokemonNombre){// si pokemon tiene algo 
                infoPokemon(pokemonNombre); // mandamos el nombre del pokemon
            }else {
                console.log('No hay informacion de este pokemon')
            }
        })
    })
}
eventoClick();
// funcion para buscar informacion general del pokemon
const infoPokemon = async (info) => {
     const pokedata = `https://pokeapi.co/api/v2/pokemon/${info}`
     
     try {
        // informacion principal del pokemon 
        const respuestainfo = await fetch(pokedata)
        const resultadoinfo = await respuestainfo.json()

        const infoPokemon = {
            id: resultadoinfo.id,
            Nombre: resultadoinfo.name,
            Altura: resultadoinfo.height,
            Peso: resultadoinfo.weight,
            Tipo: resultadoinfo.types.map(t => t.type.name).join(', '),
            Imagen: resultadoinfo.sprites,
            mostrarInfo: function(){
                document.querySelector('#id').textContent = (`Id: ${this.id}`)
                nombre.textContent = (`${this.Nombre}`)
                document.querySelector('#modal-name').textContent = (`${this.Nombre}`)
                document.querySelector('#Altura').textContent = (`Altura: ${this.Altura}`)
                document.querySelector('#Peso').textContent = (`Peso: ${this.Peso} Kg`)
                document.querySelector('#Tipo').textContent = (`Tipo: ${this.Tipo}`)
                document.querySelector('#img').src = (this.Imagen.other.showdown.front_default)
                document.querySelector('#imgModal').src = (this.Imagen.other["official-artwork"].front_default)
                document.querySelector('#imgPokemon').src = (this.Imagen.other["official-artwork"].front_default)

                // console.log(`Id: ${this.id}`)c
                // console.log(`Altura: ${this.Altura}`)
                // console.log(`Peso: ${this.Peso}`)
            }
        }

        infoPokemon.mostrarInfo();       
        
        
        
     } catch (error) {
        console.log('error al encontrar la informacion')
     }     

}

   
//---------------- MODAL -----------------
// seleccion del boton detalle 
const detalle = document.querySelector('#detalle')
//boton cerrar
const cerrar = document.querySelector('#cerrar')
// seleccion del modal
const modal = document.getElementById('modal');

const mostrarModal = () =>{    
    modal.style.display = 'block'
}

const cerrarModal = () =>{
    modal.style.display = 'none'
}

detalle.addEventListener ('click', mostrarModal)
cerrar.addEventListener('click', cerrarModal)

