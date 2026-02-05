
const cityInput = document.getElementById("cityInput");
const weatherBtn = document.getElementById("weatherBtn");
const weatherMsg = document.getElementById("weatherMsg");

const weatherSection = document.getElementById("weatherSection");

const weatherTypeDisplay = document.getElementById("weatherType");

const pokemonDisplay = document.getElementById("pokemon-display");

function setMsg(text, isError = false) {
  weatherMsg.textContent = text;
  weatherMsg.style.color = isError ? "crimson" : "#333";
}

function cleanCity(s) {
  return s.trim();
}

function xToText(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
  };
  return map[code] ?? `Weather code: ${code}`;
}

async function fetchGeo(city) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search" +
    `?name=${encodeURIComponent(city)}` +
    "&count=1&language=en&format=json";

  const res = await fetch(url);
  if (!res.ok) throw new Error("geo_failed");

  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("city_not_found");

  return data.results[0];
}

async function fetchWeather(lat, lon) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
    "&timezone=auto";

  const res = await fetch(url);
  if (!res.ok) throw new Error("weather_failed");

  return res.json();
}

function render(geo, weather) {

  const c = weather.current;

  weatherSection.innerHTML = `<article id="weatherCard" class="weather-card hidden text-center">
                                <header class="weather-header">
                                <h3 id="weatherPlace" class="weather-place">${geo.name}${geo.country ? ", " + geo.country : ""}</h3>
                                <br>
                                <p id="weatherTime" class="weather-time">Updated: ${c.time}</p>
                                </header>

                                <div class="weather-main">
                                <p class="weather-temp">
                                    <span id="weatherTemp">${ Math.round(c.temperature_2m)}</span><span class="unit">°C</span>
                                </p>
                                <p id="weatherSummary" class="weather-summary">${xToText(c.weather_code)}</p>
                                </div>

                                <div class="weather-details">
                                <div class="weather-row">
                                <span>Feels like</span>
                                <strong><span id="weatherFeels">
                                ${Math.round(c.apparent_temperature)}
                                </span>°C</strong>
                                </div>

                                <div class="weather-row">
                                <span>Humidity</span>
                                <strong><span id="weatherHumidity">
                                ${c.relative_humidity_2m}</span>%</strong>
                                </div>

                                <div class="weather-row">
                                <span>Wind</span>
                                <strong><span id="weatherWind"> ${Math.round(c.wind_speed_10m)}
                                </span> km/h</strong>
                                </div>
                                </div>
                                </article>`



    const weatherCard = document.getElementById("weatherCard");
    weatherCard.classList.remove("hidden");

    console.log(c.weather_code);
    let weatherType = weatherToPokemonConvertor(c.weather_code);


    weatherTypeDisplay.innerHTML = `<div class="text-center">
                        <p class="h5">The <span id="weatherType" class="h3">${weatherType}</span></p>
                        <p class="h5 pokemon-text">is being caused by...</p>
                        </div>`

    let pokemonType = weatherTypeToPokemonType(weatherType);
    fetchPokemon(pokemonType);
}

async function handleGetWeather() {
  const city = cleanCity(cityInput.value);

  if (!city) {
    setMsg("Enter a city name.", true);
    return;
  }

  setMsg("Loading...");
  weatherBtn.disabled = true;

  try {
    const geo = await fetchGeo(city);
    const weather = await fetchWeather(geo.latitude, geo.longitude);
    render(geo, weather);
    setMsg("");
  } catch (err) {
    if (err.message === "city_not_found") {
      setMsg("City not found. Try another name (e.g., London).", true);
    } else {
      setMsg("Request failed. Check your internet and try again.", true);
    }
  } finally {
    weatherBtn.disabled = false;
  }
}


weatherBtn.addEventListener("click", handleGetWeather);


cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleGetWeather();
});


if (!cityInput.value) cityInput.value = "London";


function weatherToPokemonConvertor (weatherCode) {
  // Get Code Number

    let x = weatherCode;
    console.log(x);

  // switch/case for groups of numbers = same 'generic weather type'
  switch (true) {

    case (x < 2):
      console.log("Sunny");
      return "Sunny";

    case (x < 49):
      console.log("Cloudy");
      return "Cloudy";

    case (x < 58):
      console.log("Drizzle");
      return "Drizzle";

    case (x < 66):
      console.log("Rain");
      return "Rain";
      
    case (x < 78):
      console.log("Snow");
      return "Snow";

    case (x < 83):
      console.log("Rain");
      return "Rain";

    case (x < 87):
      console.log("Snow");
      return "Snow";

    case (x < 100):
      console.log("Thunder and Lightning");
      return "Thunder and Lightning";

    default:
      console.log("weather not recognised");
      return "weather not recognised";
  }

}

function weatherTypeToPokemonType(weatherType){

    if (weatherType === "Sunny") {
        return "fire";
    } else if (weatherType === "Rain"){
        return "water";
    } else if (weatherType === "Thunder and Lightning"){
        return "electric";
    } else if (weatherType === "Drizzle"){
        return "grass";
    }  else if (weatherType === "Cloudy"){
        return "ghost";
    }  else if (weatherType === "Snow"){
        return "ice";
    }   
    else {
        return "normal";
    }
}

function fetchPokemon(type){
    const pokemonAPI = `https://pokeapi.co/api/v2/type/${type}/`

    pokemonDisplay.textContent = "Finding a Pokemon..."

    fetch(pokemonAPI)
    .then(response => response.json())
    .then(data => {

        const foundPokemon = data.pokemon[0].pokemon;

        return fetch (foundPokemon.url)
        
        .then(response => response.json())
        .then(details => {
            let types = [];
            for (let i=0; i<details.types.length; i++){
                types.push(details.types[i].type.name);
            }
            pokemonDisplay.innerHTML = `<h1  class="pokemon-text">${details.name}</h1>
            <img src="${details.sprites.other["official-artwork"].front_default}" class = "pokemonImage"/>
            <h2> <span class="h5"> Pokemon Type: </span> ${types.join(", ")}`;
        })
})
}

