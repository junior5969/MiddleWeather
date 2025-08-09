import {
  showLoader,
  hiddenLoader,
  buttonEffect,
  capitalizeAll,
} from "./domUtils";
import { renderWeather, renderForecast, renderFavorite,updateFavoriteSection } from "./render";
import { WeatherApiResponse, ForecastResponse } from "./types";
import { darkModeToggle } from "./domUtils";
import {
  getSearchHistory,
  saveSearchHistory,
  renderSearchHistory,
} from "./storage";

import '../style.css';

window.addEventListener("DOMContentLoaded", () => {

  // ELEMENTI TIPIZZATI
  const chronology = document.getElementById("local-storage") as HTMLDivElement;
  const loading = document.getElementById("loader-overlay") as HTMLDivElement;
  const input = document.getElementById("textbox") as HTMLInputElement;
  const form = document.getElementById("weather-form") as HTMLFormElement;
  const button = document.getElementById("button") as HTMLButtonElement;
  const darkMode = document.getElementById("dark-mode") as HTMLButtonElement;
  const favoriteContent = document.getElementById("favorite-content") as HTMLDivElement;

  hiddenLoader(loading);

  darkMode.addEventListener("click", darkModeToggle);

  async function getWeather(cityFromClick?: string): Promise<void> {
    buttonEffect(button);

    setTimeout(async () => {
      showLoader(loading);

     const apiKey = process.env.WEATHER_API_KEY;//NON SI TIPIZZA
          const city: string = cityFromClick || input.value;

     
      try {
        if (!city.trim()) {
          alert("Inserisci un nome di città valido.");
          hiddenLoader(loading);
          return;
        }

         // Chiamata Geolocalizzazione
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
          throw new Error(`Errore geolocalizzazione: ${geoResponse.status}`);
        }

        const data = (await geoResponse.json()) as {
          lat: number;
          lon: number;
          name: string;
          country: string;
        }[];

        if (!data.length) {
          throw new Error("Nessuna città trovata con questo nome.");
        }

        const { lat, lon, name } = data[0];

      
        // Chiamate in parallelo (meteo attuale + previsioni)
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=it&appid=${apiKey}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=it`)
        ]);

        if (!weatherResponse.ok) {
          throw new Error(`Errore meteo: ${weatherResponse.status}`);
        }
        if (!forecastResponse.ok) {
          throw new Error(`Errore previsioni: ${forecastResponse.status}`);
        }

        const [weatherData, forecastData] = await Promise.all([
          weatherResponse.json() as Promise<WeatherApiResponse>,
          forecastResponse.json() as Promise<ForecastResponse>
        ]);

         
        // Render interfaccia
        renderWeather(weatherData);
        renderFavorite(weatherData.name);
        updateFavoriteSection();
        renderForecast(forecastData);

        // Salva e aggiorna cronologia
        const formattedCity = capitalizeAll(city);
        saveSearchHistory(formattedCity);
        renderSearchHistory(chronology);


      } catch (error: unknown) {
        if (error instanceof Error) {
          alert("Errore: " + error.message);
          console.error(error.message);
        }
      } finally {
        hiddenLoader(loading);
      }
    }, 600);
  }

  // Event delegation: click sulla cronologia (li con classe search-city)
  chronology.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("search-city")) {
      const city = target.textContent?.trim();
      if (city) {
        input.value = city;
        getWeather(city);
      }
    }
  });

  // Event delegation: click sulla città preferita (p con classe search-city)
  favoriteContent.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("search-city")) {
      const city = target.textContent?.trim();
      if (city) {
        input.value = city;
        getWeather(city);
      }
    }
  });

  // Submit manuale dal form
  form?.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    if (!input.value.trim() || input.value.length < 2) {
      alert("Inserisci un nome di città valido.");
      return;
    }
    getWeather();
  });

});