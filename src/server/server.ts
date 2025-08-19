import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { GeoData } from "../types";

// Usa import moderno per node-fetch
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_KEY;

app.use(cors());
app.use(express.json());

app.get("/api/weather", async (req, res) => {
  const city = req.query.city as string;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    console.log(`Richiesta meteo per: ${city}`);

    // Geocoding
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    console.log("Geo response status:", geoResponse.status);
    if (!geoResponse.ok) throw new Error("Errore nella geocodifica");

    const geoData = (await geoResponse.json()) as GeoData[];
    console.log("GeoData:", geoData);

    if (!geoData.length) throw new Error("Città non trovata");

    const { lat, lon } = geoData[0];

    // Meteo attuale
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=it`
    );
    console.log("Weather response status:", weatherResponse.status);

    // Previsioni
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=it`
    );
    console.log("Forecast response status:", forecastResponse.status);

    if (!weatherResponse.ok || !forecastResponse.ok)
      throw new Error("Errore nella richiesta dati meteo");

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    res.json({ weatherData, forecastData });
  } catch (error) {
    console.error("Errore fetch:", error);
    res.status(500).json({ error: "Errore durante la richiesta meteo" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server API avviato su http://localhost:${PORT}`);
});