import { NextRequest } from "next/server";
import recommendation_movies_data from "../recommendation_movies_data.json";
import top_50_movies_recommendations from "../top_50_movies_recommendations.json";
import { Movie } from "@/app/models/movie";

interface Recommendation {
  recommendation: string;
  distance: number;
}

const get_closest_recommendation = (recommendations: Recommendation[]) => {
  let closest_recommendation = recommendations[0];
  let closest_distance = closest_recommendation.distance;

  for (let i = 1; i < recommendations.length; i++) {
    const recommendation = recommendations[i];
    const distance = recommendation.distance;

    if (distance < closest_distance) {
      closest_recommendation = recommendation;
      closest_distance = distance;
    }
  }

  return closest_recommendation;
};

const get_movie_data = (movieId: string): Movie => {
  return (recommendation_movies_data as any)[movieId];
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const moviesIds = searchParams.get("movies")?.split(",") ?? [];
  const recommendations: Recommendation[] = [];

  if (moviesIds.length === 0) {
    return new Response(
      JSON.stringify({
        error: "No movies provided",
      }),
      { status: 400 }
    );
  }

  for (const movieId of moviesIds) {
    if (!(movieId in top_50_movies_recommendations)) {
      return new Response(
        JSON.stringify({
          error: `Movie ${movieId} not found`,
        }),
        { status: 404 }
      );
    }
    recommendations.push((top_50_movies_recommendations as any)[movieId]);
  }

  return Response.json(
    get_movie_data(get_closest_recommendation(recommendations).recommendation)
  );
}
