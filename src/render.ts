//costruirre e manipoare DOM

import {
  WeatherApiResponse,
  ForecastResponse,
  ForecastEntry,
} from "./shared/types";
import { getIconById, windSpeed, averageTemp } from "./domUtils";
import { saveFavoriteCity, getFavoriteCity } from "./storage";


//WEATHER

export function renderWeather(data: WeatherApiResponse): void {
  const weatherSection = document.getElementById("result") as HTMLDivElement;
  const weatherInnerSection = document.getElementById(
    "inner-element"
  ) as HTMLDivElement;

  const iconUrl = getIconById(data.weather[0].id);
  //const temp = Math.round(kelvinToCelsius(data.main.temp));
  //const min = Math.round(kelvinToCelsius(data.main.temp_min));
  //const max = Math.round(kelvinToCelsius(data.main.temp_max));

  const temp = Math.round(data.main.temp);
  const min = Math.round(data.main.temp_min);
  const max = Math.round(data.main.temp_max);
  const wind = Math.round(windSpeed(data.wind.speed * 1.60934)); // Conversione da mph a km/h
  const today = data.dt;

  weatherSection.innerHTML = `
   <p>${new Date(today * 1000).toLocaleDateString("it-IT", {
     day: "numeric",
     month: "long",
     year: "numeric",
   })}</p>
  <img src="${iconUrl}" alt="${data.weather[0].description}">
    <h2>${temp}°C</h2>
    <h3><i class="bi bi-pin-map-fill"></i> ${data.name}</h3>
      <h4>${data.weather[0].description}</h4>
  `;

  weatherInnerSection.innerHTML = `
      <div>
      <p><i class="bi bi-thermometer-half"></i> Min:</p>
      <p>${min}°C</p>
      </div>
      <div>
        <p><i class="bi bi-thermometer-half"></i> Max:</p>
      <p>${max}°C</p>
      </div> 
    <div>
      <p>Vento:</p>
      <p><i class="bi bi-wind"></i> ${wind}km/h</p>
    </div>

  `;
}

//FORECAST

export function renderForecast(data: ForecastResponse): void {
  const forecastInnerSection = document.getElementById(
    "forecast"
  ) as HTMLDivElement;
    forecastInnerSection.innerHTML = ""; // pulisci prima

  //creiamo un oggetto per raggruppare le previsioni per data
  //ogni chiave sarà una data e il valore sarà un array di temperature per quella data
  const dailyMap: { [date: string]: ForecastEntry[] } = {};

  //iteriamo sulle previsioni e raggruppiamo per data
  //usiamo dt_txt per ottenere la data in formato YYYY-MM-DD
  //e con split e [0] prendiamo dall'array ottenuto solo la data
  //se vi è gia un array per quella data andiamo avanti, senno
  //inizializziamo l'array vuoto e poi pushiamo l'item corrente
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(item);
  });

  //eseguiamo sull'oggetto dailyMap la funzione .entries che
  //estrae le coppie chiave/valore di un array
  // entries = tutte le previsioni del giorno
  //e poi con slice prendiamo solo i primi 5 giorni
  //per ogni data, calcoliamo la temperatura media
  // otteniamo l'icona
  //e la descrizione del meteo
  //infine, creiamo un card per ogni data con i dati ottenuti

    const forecastHTML = Object.entries(dailyMap)
    .slice(0, 5)
    .map(([date, entries]) => {
      const temps = entries.map((e) => e.main.temp);
      const resultTemp = Math.round(averageTemp(temps));
      const iconUrl = getIconById(entries[0].weather[0].id);
      const { description } = entries[0].weather[0];

      return `
        <div class="forecast-card">
          <p>${new Date(date).toLocaleDateString("it-IT", {
            day: "numeric",
            weekday: "long",
          })}</p>
          <img src="${iconUrl}" alt="${description}">
          <p>${description}</p>
          <p>${resultTemp}°C</p>
        </div>
      `;
    })
    .join("");

  forecastInnerSection.innerHTML = forecastHTML;
}

//FAVORITE

export function renderFavorite(city: string): void {
  const favoriteButton = document.getElementById(
    "favorite-button"
  ) as HTMLButtonElement | null;
  if (!favoriteButton) return;

  // Aggiungi eventuali classi (opzionale)
  favoriteButton.classList.add("bi", "bi-heart-fill");

  // Rimuove eventuali listener precedenti
  const newFavoriteButton = favoriteButton.cloneNode(true) as HTMLButtonElement;
  favoriteButton.replaceWith(newFavoriteButton);

  // Nuovo listener pulito
  newFavoriteButton.addEventListener("click", () => {
    saveFavoriteCity(city); // salva nel localStorage
    updateFavoriteSection(); // aggiorna la UI
  });
}

export function updateFavoriteSection(): void {
  const content = document.getElementById("favorite-content") as HTMLDivElement;
  const city = getFavoriteCity();

  content.innerHTML = ""; // solo il contenuto, NON il bottone

  if (city) {
    const p = document.createElement("p");
    p.classList.add("search-city");
    p.style.cursor = "pointer"; // rende il testo cliccabile
    p.textContent = city;
    content.appendChild(p);
  }
}

export function newSearch(callback: (city: string) => void): void {
  const clickableCities = document.querySelectorAll(".search-city");

  clickableCities.forEach((cityElement) => {
    cityElement.addEventListener("click", () => {
      const cityName = cityElement.textContent?.trim();
      if (!cityName) return;

      const input = document.getElementById("textbox") as HTMLInputElement;
      input.value = cityName;

      callback(cityName); // richiama getWeather con la città cliccata
    });
  });
}

