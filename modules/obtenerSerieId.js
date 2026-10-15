const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

export const searchShowData = async (query) => {
  const URL = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}`;
  
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("No encontrada");
    const data = await res.json();

    return {
      id: data.id,
      name: data.name,
      rating: data.rating,
      image: data.image?.medium ?? PLACEHOLDER_IMAGE
    };
  } catch (error) {
    return null; 
  }
};


export const getShowById = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;
  
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("No encontrada");
    const data = await res.json();

    return {
      id: data.id,
      name: data.name,
      rating: data.rating,
      image: data.image?.medium ?? PLACEHOLDER_IMAGE
    };
  } catch (error) {
    return null; 
  }
};


export const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await fetch(URL).then(res => res.json());

  const episodeList = episodes.map(episode => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average
  }));

  const episodesBySeason = Object.groupBy(episodeList, (episode) => episode.season);
  return episodesBySeason;
};