import {
  showLoader,
  hiddenLoader,
  buttonEffect,
  capitalizeAll,
  darkModeToggle,
} from "./domUtils";
import { renderWeather, renderForecast, renderFavorite, updateFavoriteSection } from "./render";
import { getSearchHistory, saveSearchHistory, renderSearchHistory } from "./storage";

import "../style.css";

window.addEventListener("DOMContentLoaded", () => {
  const chronology = document.getElementById("local-storage") as HTMLDivElement;
  const loading = document.getElementById("loader-overlay") as HTMLDivElement;
  const input = document.getElementById("textbox") as HTMLInputElement;
  const form = document.getElementById("weather-form") as HTMLFormElement;
  const button = document.getElementById("button") as HTMLButtonElement;
  const darkMode = document.getElementById("dark-mode") as HTMLButtonElement;
  const favoriteContent = document.getElementById("favorite-content") as HTMLDivElement;

  hiddenLoader(loading);
  darkMode.addEventListener("click", darkModeToggle);

// URL backend
const API_BASE_URL = "https://middleweather.onrender.com/api";

async function getWeather(cityFromClick?: string): Promise<void> {
  buttonEffect(button);
  setTimeout(async () => {
    showLoader(loading);

    const city: string = cityFromClick || input.value;

      try {
        if (!city.trim()) {
          alert("Inserisci un nome di città valido.");
          hiddenLoader(loading);
          return;
        }

        // Chiamata unica al backend sicuro
      const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`);

      if (!response.ok) throw new Error(`Errore server: ${response.status}`);

      const { weatherData, forecastData } = await response.json();

        // Render interfaccia
        renderWeather(weatherData);
        renderFavorite(weatherData.name);
        updateFavoriteSection();
        renderForecast(forecastData);

        // 💾 Salva cronologia ricerche
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

  // 📌 Eventi: cronologia e preferiti
  chronology.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("search-city")) {
      const city = target.textContent?.trim();
      if (city) getWeather(city);
    }
  });

  favoriteContent.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("search-city")) {
      const city = target.textContent?.trim();
      if (city) getWeather(city);
    }
  });

  // 🔍 Form di ricerca
  form?.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    if (!input.value.trim() || input.value.length < 2) {
      alert("Inserisci un nome di città valido.");
      return;
    }
    getWeather();
  });
});
