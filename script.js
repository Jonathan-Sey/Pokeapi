
const buscar = document.querySelector('#buscar') // input buscar
const url = 'https://pokeapi.co/api/v2/pokemon/'
let limitador = 20;

// funcion para buscar informacion general del pokemon
const infoPokemon = async (nombre, Evolucion = false) => {
    // url con la informacion del pokemon
     const pokedata = `${url}${nombre.toLowerCase()}`;
    
     try {
        // informacion principal del pokemon 
        const respuestainfo = await fetch(pokedata);
        const resultadoinfo = await respuestainfo.json(); // name, id, img, etc
        const evolucionesPokemon = []
      
        
        
        // url con la informacion de las species
        const resultadoEvo = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${resultadoinfo.id}/`)
        const respuestaEvo = await resultadoEvo.json();
        // url con las evoluciones del pokemon
        const respuesta = await fetch(respuestaEvo.evolution_chain.url)
        const resultado = await respuesta.json()
        //console.log(resultado)

      
        let array = resultado.chain; //variable que tiene la ruta de las evolucinoes 
        
        while(array){
            //obtenemos el nombre de la primera Evolucion
             const nombres = array.species.name
             // obtenemos la img de la evolucion del pokemon
             const evolucionInfo = await obtenerImagen(nombres);
             evolucionesPokemon.push(evolucionInfo)
             // asignamos una nueva ruta dentro del arreglo 
           
              array = array.evolves_to[0]
         }
         if(Evolucion){
            return{
                Imagen: resultadoinfo.sprites.other["official-artwork"].front_default,
                Id: resultadoinfo.id,
                Nombre: resultadoinfo.name,
                Peso: resultadoinfo.weight,
                Altura: resultadoinfo.height,
                Tipo: resultadoinfo.types.map(t => t.type.name).join(', '),
                Evoluciones: evolucionesPokemon.map(e => e.Nombre).join(', ')
            }
        }

              
        const infoPokemon = {
            id: resultadoinfo.id,
            Nombre: resultadoinfo.name,
            //Altura: resultadoinfo.height,
            //Peso: resultadoinfo.weight,
            //Tipo: resultadoinfo.types.map(t => t.type.name).join(', '),
            Imagen: resultadoinfo.sprites.other["official-artwork"].front_default,
            //Color: respuestaEvo.color.name,
            Evoluciones: evolucionesPokemon
        };
        
        generarPokemon(infoPokemon); 
        
     } catch (error) {
        //console.log('error al encontrar la informacion', error)
        mostrarError(`No se encontro el Pokémon "${nombre}". Favor de Ingresar el nombre o id del pokemon.`);
     }     
};


const obtenerImagen = async (nombre) => {
    try {
        const pokedata = `${url}${nombre.toLowerCase()}`;
        const respuestainfo = await fetch(pokedata);
        const resultadoinfo = await respuestainfo.json();
        return {
            Imagen: resultadoinfo.sprites.other["official-artwork"].front_default,
            Nombre: nombre
        };    
    } catch (error) {
        mostrarError("Error al obtener las imagenes de las evoluciones")
    }
    
};
//console.log(evolucionesPokemon)

const generarPokemon =  async (pokemones) => {
    
    const contenidoPokemon = document.querySelector('.contenedor-popkemon')
//    contenidoPokemon.innerHTML = ''
    //console.log(pokemones)
    
    const html = `
    <div class="contenido-pokemones " >
        <div class="grid" >
            <div class="info-pokemon">
                <img class="imgPokemon img-pokemon" src="${pokemones.Imagen}" alt="${pokemones.Nombre}"> 
                <h3 class="nombre">${pokemones.Nombre}</h3>
                <button class="botones boton   detalle" id-pokemon="${pokemones.id}">Ver detalle</button>
            </div>                
            <div class="evolucion-pokemon">
                ${pokemones.Evoluciones.map(evo => `
                    <img class="" src="${evo.Imagen}" alt="${evo.Nombre}">`)}
            </div>
        </div>
    </div>
    `;
    // Inserta el nuevo contenido
    contenidoPokemon.innerHTML += html; 
};
// Mostrar los errores en pantalla
const mostrarError = (mensaje) => {
    const contenidoPokemon = document.querySelector('.contenedor-popkemon');
    contenidoPokemon.innerHTML = `<p class='contenedor error' >${mensaje}</p>`;
};


// Principal
const prueba = async() => {

    try {
        // consulta a la api de los pokemons
        const resultadoPrueba = await fetch(`${url}?limit=${limitador}`)
        const respuestaPrueba = await resultadoPrueba.json()
        
        // obtenemos los nombres de los pokemons
        const tipos = respuestaPrueba.results.map(t => t.name)
        console.log(tipos)
        // enviamos la info de manera individual para procesar la informacion 
        for(const namePokemon of tipos){
            await  infoPokemon(namePokemon);
        }
        
    } catch (error) {
        console.error('Error al consumir la api', error);
        mostrarError("Lo sentimos, pero el servicio de PokeAPI no esta disponible en este momento")
    } 
}
// sumador
document.addEventListener('DOMContentLoaded', () => { 
	const boton = document.getElementById('mas'); //boton ver mas
	boton.addEventListener('click', async () => { 
        limitador += 20;// sumador 
        const contenidoPokemon = document.querySelector('.contenedor-popkemon');
        contenidoPokemon.innerHTML = ''; // Limpiar contenedor
	    await prueba(); // llamamos a prueba pero ahora el limitador vale + 20
	}); 
});

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.querySelector('.contenedor-popkemon');
    contenedor.addEventListener('click', async (e) => {
        // Verificar si presionamos el boton con la clase detalle
        if (e.target.classList.contains('detalle')) {
            const idPokemon = e.target.getAttribute('id-pokemon');
          //  alert(`El id del pokemon es: ${idPokemon}`);
            const info = await infoPokemon(idPokemon, true)
            mostrarInformacion(info)
        }
    });
});



// modal con info del pokemon
const mostrarInformacion = (info) => {
    Swal.fire({
        title: `Detalles del Pokémon`,
        html: `
            <p><strong>ID:</strong> ${info.Id}</p>
            <p><strong>Nombre:</strong> ${info.Nombre}</p>
            <p><strong>Tipo:</strong> ${info.Tipo}</p>
            <p><strong>Peso:</strong> ${info.Peso} kg</p>
            <p><strong>Altura:</strong> ${info.Altura}</p>
            <p><strong>Evoluciones:</strong> ${info.Evoluciones}</p>
        `,
        imageUrl: `${info.Imagen}`,
        imageWidth: 180,
        imageHeight: 180,
        imageAlt: `${info.Nombre}`,
        confirmButtonText: 'Cerrar'
    });
};

// buscador
buscar.addEventListener('input', async (e) =>{ 
    const datobuscado = e.target.value.trim(); // valor ingresado 
    const contenidoPokemon = document.querySelector('.contenedor-popkemon');
    contenidoPokemon.innerHTML = ''; // Limpiar contenedor
    if (datobuscado) {
        // Si encuentra el Pokémon buscado
            await infoPokemon(datobuscado);
        } else {
           prueba();
        }    
})
prueba();


