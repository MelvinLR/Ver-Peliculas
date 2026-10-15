import { searchShowData, getShowById, getEpisodeList } from "../modules/obtenerSerieId.js";
import { createAllSeasonsHTML } from "../modules/episodiosTem.js";


const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");
const $searchInput = document.querySelector("#searchInput");
const $searchButton = document.querySelector("#searchButton");


const renderApp = async (query) => {
  $header.setHTMLUnsafe(`<h2>Buscando "${query}"...</h2>`);
  $episodes.setHTMLUnsafe("");

  let show;

  // Validar si la búsqueda es un número (ID) o un texto (Nombre)
  if (!isNaN(query)) {
    show = await getShowById(query); // Busca por ID
  } else {
    show = await searchShowData(query); // Busca por nombre
  }

  if (!show) {
    $header.setHTMLUnsafe(`<h2>Serie no encontrada. Intenta con otra.</h2>`);
    return;
  }

  
  const seasons = await getEpisodeList(show.id);

  
  $header.setHTMLUnsafe(`
    <img class="poster" src="${show.image}" alt="Poster de ${show.name}">
    <h1>${show.name}</h1>
  `);

 
  const seasonsHTML = createAllSeasonsHTML(seasons);
  $episodes.setHTMLUnsafe(seasonsHTML);
};


$searchButton.addEventListener("click", () => {
  const query = $searchInput.value.trim();
  if (query) renderApp(query);
});


$searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const query = $searchInput.value.trim();
    if (query) renderApp(query);
  }
});


renderApp("2993"); 