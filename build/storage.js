"use strict";
//localStorage RICERCHE RECENTI
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSearchHistory = exports.saveSearchHistory = exports.getSearchHistory = void 0;
exports.saveFavoriteCity = saveFavoriteCity;
exports.getFavoriteCity = getFavoriteCity;
const STORAGE_KEY = 'recentSearches';
const getSearchHistory = () => {
    let history = [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        history = data ? JSON.parse(data) : [];
    }
    catch (error) {
        console.error("Errore nel parsing della cronologia ricerche:", error);
        history = [];
    }
    return history;
};
exports.getSearchHistory = getSearchHistory;
const saveSearchHistory = (query) => {
    let history = (0, exports.getSearchHistory)();
    history = history
        .filter((item) => typeof item === "string") // filtriamo eventuali null/undefined
        .filter(item => item.toLowerCase() !== query.toLowerCase());
    history.unshift(query);
    if (history.length > 5)
        history = history.slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};
exports.saveSearchHistory = saveSearchHistory;
const renderSearchHistory = (container) => {
    const history = (0, exports.getSearchHistory)();
    container.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = "Ricerche recenti:";
    title.classList.add("title-storage");
    container.appendChild(title);
    const ol = document.createElement("ol");
    ol.classList.add("list-storage");
    history.forEach((query) => {
        const li = document.createElement("li");
        li.textContent = query;
        li.classList.add("search-city");
        ol.appendChild(li);
    });
    container.appendChild(ol);
};
exports.renderSearchHistory = renderSearchHistory;
//localStorage CITTA' PREFERITA
const FAVORITE_KEY = "favoriteCity";
function saveFavoriteCity(city) {
    try {
        localStorage.setItem(FAVORITE_KEY, city);
    }
    catch (error) {
        console.error("Errore nel salvataggio della città preferita:", error);
    }
}
function getFavoriteCity() {
    try {
        return localStorage.getItem(FAVORITE_KEY);
    }
    catch (error) {
        console.error("Errore nel recupero della città preferita:", error);
        return null;
    }
}
