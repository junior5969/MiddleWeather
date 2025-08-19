"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domUtils_1 = require("./domUtils");
const render_1 = require("./render");
const domUtils_2 = require("./domUtils");
const storage_1 = require("./storage");
require("../style.css");
window.addEventListener("DOMContentLoaded", () => {
    // ELEMENTI TIPIZZATI
    const chronology = document.getElementById("local-storage");
    const loading = document.getElementById("loader-overlay");
    const input = document.getElementById("textbox");
    const form = document.getElementById("weather-form");
    const button = document.getElementById("button");
    const darkMode = document.getElementById("dark-mode");
    const favoriteContent = document.getElementById("favorite-content");
    (0, domUtils_1.hiddenLoader)(loading);
    darkMode.addEventListener("click", domUtils_2.darkModeToggle);
    async function getWeather(cityFromClick) {
        (0, domUtils_1.buttonEffect)(button);
        setTimeout(async () => {
            (0, domUtils_1.showLoader)(loading);
            const apiKey = process.env.WEATHER_API_KEY;
            if (!apiKey) {
                throw new Error('API key non trovata! Controlla il file .env');
            }
            const city = cityFromClick || input.value;
            try {
                if (!city.trim()) {
                    alert("Inserisci un nome di città valido.");
                    (0, domUtils_1.hiddenLoader)(loading);
                    return;
                }
                // Chiamata Geolocalizzazione
                const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
                const geoResponse = await fetch(geoUrl);
                if (!geoResponse.ok) {
                    throw new Error(`Errore geolocalizzazione: ${geoResponse.status}`);
                }
                const data = (await geoResponse.json());
                if (!data.length) {
                    throw new Error("Nessuna città trovata con questo nome.");
                }
                const { lat, lon, name } = data[0];
                // Chiamate in parallelo (meteo attuale + previsioni)
                const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}&lat=${lat}&lon=${lon}`);
                if (!response.ok)
                    throw new Error(`Errore server: ${response.status}`);
                const { weatherData, forecastData } = await response.json();
                // Render interfaccia
                (0, render_1.renderWeather)(weatherData);
                (0, render_1.renderFavorite)(weatherData.name);
                (0, render_1.updateFavoriteSection)();
                (0, render_1.renderForecast)(forecastData);
                // Salva e aggiorna cronologia
                const formattedCity = (0, domUtils_1.capitalizeAll)(city);
                (0, storage_1.saveSearchHistory)(formattedCity);
                (0, storage_1.renderSearchHistory)(chronology);
            }
            catch (error) {
                if (error instanceof Error) {
                    alert("Errore: " + error.message);
                    console.error(error.message);
                }
            }
            finally {
                (0, domUtils_1.hiddenLoader)(loading);
            }
        }, 600);
    }
    // Event delegation: click sulla cronologia (li con classe search-city)
    chronology.addEventListener("click", (e) => {
        const target = e.target;
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
        const target = e.target;
        if (target.classList.contains("search-city")) {
            const city = target.textContent?.trim();
            if (city) {
                input.value = city;
                getWeather(city);
            }
        }
    });
    // Submit manuale dal form
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!input.value.trim() || input.value.length < 2) {
            alert("Inserisci un nome di città valido.");
            return;
        }
        getWeather();
    });
});
