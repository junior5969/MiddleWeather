# MiddleWeather 🌤️

MiddleWeather è un'applicazione web per consultare il meteo e le previsioni delle città in tempo reale. 

---

## 🔗 Link Live

Puoi accedere all'app direttamente su Render:

[https://middleweather.onrender.com](https://middleweather.onrender.com)

---

## 🚀 Come si usa

1. Apri il link dell'app.  
2. Inserisci il nome di una città nel campo di ricerca.  
3. Premi il pulsante di ricerca.  
4. Visualizza le informazioni sul meteo attuale e le previsioni dei prossimi 5 giorni.  
5. Salva le città preferite per un accesso rapido.  
6. Consulta la cronologia delle ultime 5 ricerche.

---

## Funzionalità

- Visualizzazione meteo attuale (temperatura, vento, ecc.).  
- Previsioni a 5 giorni.  
- Gestione dei preferiti.  
- Cronologia delle ricerche salvata localmente.  
- Modalità scura (Dark Mode).  

---

## 🛠️ Architettura e tecnologia

- **Frontend:** TypeScript + Webpack, con gestione dinamica DOM e moduli separati (`render.ts`, `domUtils.ts`, `storage.ts`).  
- **Backend:** Node.js + Express, con endpoint API sicuri che chiamano l’OpenWeather API.  
- **Hosting:** Render.    
- **API Key:** Salvata sul server, mai esposta nel frontend.

---

## Esecuzione in locale
 
  1. Clona il repository.  
  2. Esegui `npm install` nella root del progetto.  
  3. Imposta la variabile d'ambiente `OPENWEATHER_API_KEY` nel file `.env`.  
  4. Compila il progetto eseguendo `npm run build`.
  5. Avvia il server stabile con `npm start`. 
  6. Apri `http://localhost:5000` per testare l’app.  

---

## Configurazione su Render

- **Build Command:** `npm install && npm run build`.  
- **Start Command:** `node dist/server/server.js`.  
- **Environment variables key:** `OPENWEATHER_API_KEY`.    

---

## 📄 Autrice

Barletta Chiara