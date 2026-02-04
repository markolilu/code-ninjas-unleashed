const pokemonNames = "https://pokeapi.co/api/v2/pokemon?limit=1350"

    fetch(pokemonNames)
    .then(response => response.json())

    .then(data => {

        for (let i=0; i<data.results.length; i++) {

            fetch(data.results[i].url)
            .then(response => response.json())
            .then(details => {

            let types=[];

            for (let j=0; j<details.types.length; j++){
                types.push(details.types[j].type.name);
            }

            console.log(details.name, types);
        });

    }});