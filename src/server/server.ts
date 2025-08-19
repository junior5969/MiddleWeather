import express from "express";
import path from 'path';
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { GeoData } from "../types";

dotenv.config();

const app = express();

// Verifica API_KEY
const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  console.error("❌ OPENWEATHER_API_KEY non è definita!");
  process.exit(1);
}

// Middleware CSP e CORS
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' https:;
      connect-src 'self' https://api.openweathermap.org;
    `.replace(/\n/g, ' ')
  );
  next();
});

// Servi i file statici della cartella dist
app.use(express.static(path.join(__dirname, '../dist')));

// Endpoint meteo
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

    // Meteo attuale e forecast
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=it`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=it`)
    ]);

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

// Tutte le altre route servono index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Porta dinamica per Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT} o su Render`);
});