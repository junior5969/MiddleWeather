"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch")); // Assicurati di avere node-fetch installato
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ===== Middleware per servire il frontend =====
app.use(express_1.default.static(path_1.default.join(__dirname, '../../dist')));
// ===== Route API per il meteo =====
app.get('/api/weather', async (req, res) => {
    const { lat, lon, city } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey)
        return res.status(500).json({ error: 'API key mancante' });
    if (!lat || !lon || !city)
        return res.status(400).json({ error: 'Parametri mancanti: lat, lon, city' });
    try {
        // Meteo attuale
        const weatherResponse = await (0, node_fetch_1.default)(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=it`);
        const weatherData = await weatherResponse.json();
        // Forecast
        const forecastResponse = await (0, node_fetch_1.default)(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=it`);
        const forecastData = await forecastResponse.json();
        res.json({ weatherData, forecastData });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Errore server durante fetch API meteo' });
    }
});
// ===== SPA fallback =====
app.get('/*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../dist/index.html'));
});
// ===== Avvio server =====
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
