
//localStorage RICERCHE RECENTI


type SearchHistory = string[];

const STORAGE_KEY = 'recentSearches';

export const getSearchHistory = (): SearchHistory => {
let history:string []= [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    history= data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Errore nel parsing della cronologia ricerche:", error);
    history= [];
  }
  return history;
};

export const saveSearchHistory = (query: string): void => {
  let history = getSearchHistory();

  history = history
  .filter((item): item is string => typeof item === "string") // filtriamo eventuali null/undefined
  .filter(item => item.toLowerCase() !== query.toLowerCase());
  history.unshift(query);

  if (history.length > 5) history = history.slice(0, 5);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};


export const renderSearchHistory = (container: HTMLElement): void => {
  const history = getSearchHistory();
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


//localStorage CITTA' PREFERITA

const FAVORITE_KEY = "favoriteCity";

export function saveFavoriteCity(city: string): void {
  try {
    localStorage.setItem(FAVORITE_KEY, city);
  } catch (error) {
    console.error("Errore nel salvataggio della città preferita:", error);
  }
}


export function getFavoriteCity(): string | null {
  try {
    return localStorage.getItem(FAVORITE_KEY);
  } catch (error) {
    console.error("Errore nel recupero della città preferita:", error);
    return null;
  }
}