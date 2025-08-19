"use strict";
//stile e manipolazione DOM ma senza creare contenuti
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIconById = getIconById;
exports.kelvinToCelsius = kelvinToCelsius;
exports.windSpeed = windSpeed;
exports.averageTemp = averageTemp;
exports.showLoader = showLoader;
exports.hiddenLoader = hiddenLoader;
exports.buttonEffect = buttonEffect;
exports.darkModeToggle = darkModeToggle;
exports.capitalizeAll = capitalizeAll;
function getIconById(id) {
    if (id >= 200 && id < 300)
        return "./img/stormy.png";
    if (id >= 300 && id < 400)
        return "./img/shower.png";
    if (id >= 500 && id < 600)
        return "./img/rainy.png";
    if (id >= 600 && id < 700)
        return "./img/snowy.png";
    if (id >= 700 && id < 800)
        return "./img/misty.png";
    if (id === 800)
        return "./img/sunny.png";
    if (id > 800 && id < 900)
        return "./img/cloudy.png";
    return "./img/default.png";
}
function kelvinToCelsius(temperature) {
    return temperature - 273.15;
}
function windSpeed(wind) {
    return wind * 1.60934;
}
function averageTemp(temperatures) {
    //dall'array di tutte le temperature si calcola la media con reduce dove
    //a è il valore che viene ogni volta aggiornato, mentre b è ogni elemento dell'array, e si parte da 0
    // quindi ad esempio 0+2=2 allora a diventa 2 e si somma il secondo b
    const sum = temperatures.reduce((a, b) => a + b, 0);
    const average = sum / temperatures.length;
    return parseFloat(average.toFixed(1)); // oppure: Number(average.toFixed(1))
}
function showLoader(element) {
    element.style.display = "flex";
    element.style.position = "fixed";
    element.style.textAlign = "center";
    element.style.flexDirection = "column";
    element.style.zIndex = "999";
    element.style.top = "0";
    element.style.left = "0";
    element.style.backgroundColor = "rgb(58, 154, 192)";
    element.style.height = "100vh";
    element.style.width = "100vw";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";
    const loader = document.querySelector(".loader");
    if (loader)
        loader.style.display = "flex";
}
//void perche non resistuiscono nulla (solo stile)
function hiddenLoader(element) {
    element.style.display = "none";
    element.removeAttribute("style");
    const loader = document.querySelector(".loader");
    if (loader)
        loader.style.display = "none";
}
function buttonEffect(element) {
    // Rimuovi prima l'animazione
    element.style.animation = "none";
    // Forza il reflow (per "resettare" l'animazione)
    void element.offsetWidth;
    // Riapplica l'animazione
    element.style.animation = "rotate 0.5s linear";
}
function darkModeToggle() {
    const body = document.body;
    body.classList.toggle("dark-mode");
}
function capitalizeAll(text) {
    return text
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
