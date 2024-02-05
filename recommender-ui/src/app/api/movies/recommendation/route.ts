import { NextRequest } from "next/server";
import untyped_movies_data from "../../../data/recommendations_movies_data.json";
import untyped_recommendations from "../../../data/recommendations.json";

const recommendations = untyped_recommendations as {
  vector: number[];
  matrix: number[][];
};

const movies_data = untyped_movies_data as Record<string, any>;

const compute_movies_distance = (
  reference_movie_idx: number,
  movies_idx: number[]
) => {
  const matrix = (recommendations as any).matrix;

  let distance = 0;

  for (const movie_idx of movies_idx) {
    distance += matrix[reference_movie_idx][movie_idx];
  }

  return distance;
};

const get_closest_recommendation = (movie_ids: string[]) => {
  const vector = (recommendations as any).vector;
  const matrix = (recommendations as any).matrix;
  const m = matrix.length;
  const movies_idx = movie_ids.map((movie_id) =>
    vector.indexOf(parseInt(movie_id))
  );

  let candidate_movie_idx = -1;
  let candidate_movie_distance = Infinity;

  for (let idx = 0; idx < m; idx++) {
    if (movies_idx.includes(idx)) continue;
    // We dont have data for this movie :D
    if (idx === 830) continue;

    const distance = compute_movies_distance(idx, movies_idx);

    if (distance < candidate_movie_distance) {
      candidate_movie_idx = idx;
      candidate_movie_distance = distance;
    }
  }

  return vector[candidate_movie_idx];
};

const get_movie_data = (movie_id: number): any => {
  return movies_data[movie_id.toString()];
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const moviesIds = searchParams.get("movies")?.split(",") ?? [];

  if (moviesIds.length === 0) {
    return new Response(
      JSON.stringify({
        error: "No movies provided",
      }),
      { status: 400 }
    );
  }

  return Response.json(get_movie_data(get_closest_recommendation(moviesIds)));
}
