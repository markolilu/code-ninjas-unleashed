document.getElementById("generateBtn").addEventListener("click", onFetchPokemon);


// Getting the data from the Pokemon API

function onFetchPokemon() {

    const type = document.getElementById("typeSelect").value;

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
            <img src="${details.sprites.front_default}"/>`;
        })
})
}


// Pokemon types: fire, water, electric, grass, ice, fighting, poision, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy
// fire = sunny
// water = raining
// stormy = electric
// snowing = ice
// windy = flying
// volcano = dragon

// Weather codes:
// Thunderstorm : 200-232
// Drizzle : 300-321
// Rain : 500-531
// Snow : 600-622
// Mist/Fog : 701-781
// Clear : 800-802
// Clouds : 803-804




// function getPokemonForWeather(weather){
if (weather === "Clear") {
    return "fire";
} else if (weather === "Raining"){
    return "water";
} else if (weather === "Stormy"){
    return "electric";
} else if (weather === "Snowing"){
    return "ice";
} else if (weather === "Windy"){
    return "flying";
} else if (weather === "Volcanic Ash"){
    return "dragon";
} else {
    return "normal";
}

