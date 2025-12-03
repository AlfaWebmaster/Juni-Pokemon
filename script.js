
const select = document.getElementById("pokemon");
async function cargarPokemonEnSelector(limit = 50) {
    
    try{

        //Hacer petición  a la API
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);

        //Verificar si la respuesta es correcta.
        if(!res.ok){
            throw new Error(`Error HTTP:${res.status}`);
        }

        //Convertir la respuesta a JSON
        const data = await res.json();
        

        //limpiar select
        select.innerHTML = "";
        
        //Añadir opción por defecto
        const defeaultOpt= document.createElement("option");
        defeaultOpt.value="";
        defeaultOpt.textContent="Seleciona un Pokémon";
        select.appendChild(defeaultOpt);

        //Crear cada opción de Pokémon
        data.results.forEach(p=> {
            const opt = document.createElement("option");
            opt.value = p.name;

            //Corregido: Formatear nombre (primera letra mayúscula)
            opt.textContent = p.name.charAt(0).toUpperCase() + p.name.slice(1);
            select.appendChild(opt);
        });
    } catch (err){
        console.error("Error cargando Pokémon:", err);
    }
}
//Ejecutar al cargar página
cargarPokemonEnSelector(50);

// PARA CARGAR LA INFORMACION DE LOS POKÉMON

const detalles = document.getElementById("pokemon-detalles");

function renderDetalles(pokemon){
// Conversión  de unidades: peso( hectogramos -kg), altura (decimentros-metros).
const pesoKg = (pokemon.weight/10).toFixed(1);
const alturaM= (pokemon.height/10).toFixed(2);

 //Habildiades (Filtrado de habilidades ocultas si quieres)
 const habilidades =pokemon.abilities
 .map(a=> a.ability.name)
 .map(n=> n.charAt(0).toUpperCase() + n.slice(1))
 .join(",");

 detalles.innerHTML=`
 <h4>${pokemon.name.charAt(0).toUpperCase()+ pokemon.name.slice(1)}</h4>
 <img Src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
 <ul> 
 <li><strong> Habilidades:</strong> ${habilidades || "-"}  </li>
 <li><strong> Peso: </strong> ${pesoKg} Kg</li>
 <li><strong> Altura: </strong> ${alturaM} m  </li>
 </ul>
 `;
}
 async function mostrarPokemonSeleccionado(nombre) {
    if (!nombre){
        detalles.innerHTML="";
        return;
    }
    //Etado de la carga 
    detalles.innerHTML="<P> Cargando Detalles... </p>";
    try {
        const res=await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`);
        if(!res.ok){
            throw new Error(`Error HTTP ${res.status}`);
        }
        const data = await res.json();
        renderDetalles(data);
    }catch(err) {
        console.error("Error obteniendo detalles del Pokémon:", err);
        detalles.innerHTML=`<p><stronge> Error: </strong> No se pudieron cargar los detalles. Intenta nuevamente </p> `;
    }
 }
 //Escuchar cambios en el selector

 select.addEventListener("change",(e)=>{
    mostrarPokemonSeleccionado(e.target.value)
 })


