export const createEpisodeHTML = (episode) => `
  <div class="episode episode-${episode.number} rating-${Math.round(episode.rating || 0)}">${episode.number}</div>
`;

export const createSeasonHTML = (data, number) => `
  <article class="season">
    <header class="season-header">T${number}</header>
    ${data.map(createEpisodeHTML).join("")}
  </article>
`;

export const createAllSeasonsHTML = (seasons) => {
  // Recorre el objeto de temporadas y genera el HTML completo
  return Object.values(seasons)
    .map((season, index) => createSeasonHTML(season, index + 1))
    .join("");
};