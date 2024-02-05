import top_50_movies_recommendations from "./top_50_movies_recommendations.json";
import recommendation_movies_data from "./recommendation_movies_data.json";

const get_main_movies_data = () => {
  const main_movies_ids = new Set(Object.keys(top_50_movies_recommendations));

  return Object.entries(recommendation_movies_data)
    .filter(([movie_id, movie_data]) => main_movies_ids.has(movie_id))
    .map(([id, movie_data]) => ({ ...movie_data, id }));
};

export async function GET(req: Request) {
  const main_movies = get_main_movies_data();

  return Response.json(main_movies);
}
