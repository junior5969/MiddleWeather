
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import fetch from "node-fetch"; // 
import { GeoData } from "../types";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_KEY;

app.use(cors());
app.use(express.json());

// 🔹 Endpoint meteo
app.get("/api/weather", async (req, res) => {
  const city = req.query.city as string;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    // Geocoding
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    const geoData = (await geoRes.json()) as GeoData[];

    if (!geoData.length) return res.status(404).json({ error: "Città non trovata" });

    const { lat, lon } = geoData[0];

    // Meteo attuale
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=it`
    );
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=it`
    );

    if (!weatherRes.ok || !forecastRes.ok)
      return res.status(500).json({ error: "Errore nella richiesta dati meteo" });

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    res.json({ weatherData, forecastData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore server interno" });
  }
});

// 🔹 Avvio server
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});