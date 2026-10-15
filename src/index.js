const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

// Función para buscar la serie por NOMBRE usando la API de búsqueda
const searchShowData = async (query) => {
  const URL = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}`;
  
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("No encontrada");
    const data = await res.json();

    return {
      id: data.id, // Necesitamos el ID para luego buscar los episodios
      name: data.name,
      rating: data.rating,
      image: data.image?.medium ?? PLACEHOLDER_IMAGE
    }
  } catch (error) {
    return null; // Retorna null si la serie no existe
  }
}

// Función original intacta (solo recibe el id que le pasaremos ahora)
const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await fetch(URL).then(res => res.json());

  const episodeList = episodes.map(episode => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average
  }));

  const episodesBySeason = Object.groupBy(episodeList, (episode) => episode.season);
  return episodesBySeason;
}

// Selectores del DOM
const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");
const $searchInput = document.querySelector("#searchInput");
const $searchButton = document.querySelector("#searchButton");

// Función principal que renderiza todo
const renderApp = async (query) => {
  // Mostrar mensaje de carga
  $header.setHTMLUnsafe(`<h2>Buscando "${query}"...</h2>`);
  $episodes.setHTMLUnsafe("");

  // 1. Buscamos la serie por nombre
  const show = await searchShowData(query);

  if (!show) {
    $header.setHTMLUnsafe(`<h2>Serie no encontrada. Intenta con otra.</h2>`);
    return;
  }

  // 2. Si existe, buscamos sus episodios usando su ID
  const seasons = await getEpisodeList(show.id);

  // 3. Renderizamos el Header
  $header.setHTMLUnsafe(`
    <img class="poster" src="${show.image}" alt="Poster de ${show.name}">
    <h1>${show.name}</h1>
  `);

  // 4. Renderizamos los episodios
  const createEpisodeHTML = (episode) => `
    <div class="episode episode-${episode.number} rating-${Math.round(episode.rating || 0)}">${episode.number}</div>
  `;

  const createSeasonHTML = (data, number) => `
    <article class="season">
      <header class="season-header">T${number}</header>
      ${data.map(createEpisodeHTML).join("")}
    </article>
  `;

  const list = Object.values(seasons).map((season, index) => createSeasonHTML(season, index + 1));
  $episodes.setHTMLUnsafe(list.join(""));
};

// --- EVENTOS DEL BUSCADOR ---

// Al hacer clic en el botón
$searchButton.addEventListener("click", () => {
  const query = $searchInput.value.trim();
  if (query) renderApp(query);
});

// Al presionar la tecla "Enter" en el input
$searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const query = $searchInput.value.trim();
    if (query) renderApp(query);
  }
});

// Cargar una serie por defecto al entrar a la página (opcional)
renderApp("Stranger Things");