document.getElementById("generateBtn").addEventListener("click", onFetchPokemon);

function onFetchPokemon() {

    const weather = document.getElementById("weatherSelect").value;

    let type;

    if (weatherType === "Sunny") {
        type = "fire";
    } else if (weatherType === "Rain"){
        type = "water";
    } else if (weatherType === "Thunder and Lightning"){
        type = "electric";
    } else if (weatherType === "Drizzle"){
        type = "grass";
    }  else if (weatherType === "Cloudy"){
        type = "ghost";
    }  else if (weatherType === "Snow"){
        type = "ice";
    }   
    else {
        type = "normal";
    }

    const pokemonAPI = `https://pokeapi.co/api/v2/type/${type}/`

    const display = document.getElementById("pokemonDisplay");

    fetch(pokemonAPI)
    .then(response => response.json())
    .then(data => {

        const foundPokemon = data.pokemon[0].pokemon;

        fetch (foundPokemon.url)
        .then(response => response.json())
        .then(details => {
            let types = [];
            for (let i=0; i<details.types.length; i++){
                types.push(details.types[i].type.name);
            }
            display.innerHTML = `<h1>${details.name}</h1>
            <img src="${details.sprites.front_default}"/>
            <h2> pokemon type: ${types}`;
        })
})
}