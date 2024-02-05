"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Row from "./components/Row";
import { Movie } from "./models/movie";
import styles from "./page.module.css";
import Modal from "./components/Modal";
import DetailedMovieModal from "./components/DetailedMovieModal";

type SelectedMovies = string[];

const TOTAL_MOVIES_SELECT = 3;

const extract_youtube_video_id = (url: string) => {
  return url.match(/(?<=v=).+$/)![0];
};

const mapMovie = (data: any): Movie => {
  return {
    ...data,
    img_url: `https://${data.img_url}`,
    trailer_videos_ids: data.trailer_videos_urls.map((url: string) =>
      extract_youtube_video_id(url)
    ),
  };
};

const get_movies = async (): Promise<Movie[]> => {
  const response = await fetch("http://localhost:3000/api/movies");
  const data: Movie[] = await response.json();

  return data.map((movie) => mapMovie(movie));
};

const create_movies_groups = (movies: Movie[]): Movie[][] => {
  const qty = 4;
  const movies_groups: Movie[][] = [];

  for (let idx = 0; idx < qty; idx++) {
    movies_groups.push([]);
  }

  for (let idx = 0; idx < movies.length; idx++) {
    const group_idx = idx % qty;
    movies_groups[group_idx].push(movies[idx]);
  }

  return movies_groups;
};

const get_recommendation = async (
  selectedMovies: SelectedMovies
): Promise<Movie> => {
  const response = await fetch(
    `http://localhost:3000/api/movies/recommendation?${new URLSearchParams({
      movies: selectedMovies as any,
    }).toString()}
    `
  );
  const data = await response.json();

  return mapMovie(data);
};

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<SelectedMovies>([]);
  const [recommendedMovie, setRecommendedMovie] = useState<Movie>();
  const movies_groups = useMemo(
    () => (movies.length ? create_movies_groups(movies) : []),
    [movies]
  );

  useEffect(() => {
    get_movies().then((data) => {
      setMovies(data);
    });
  }, []);

  useEffect(() => {
    if (selectedMovies.length === TOTAL_MOVIES_SELECT) {
      get_recommendation(selectedMovies).then((recommendedMovie) => {
        setRecommendedMovie(recommendedMovie);
      });
    }
  }, [selectedMovies]);

  const handleMovieClick = useCallback((movieId: string) => {
    setSelectedMovies((prev) => {
      if (prev.length === TOTAL_MOVIES_SELECT && !prev.includes(movieId)) {
        return prev;
      }

      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  }, []);

  const handleCloseRecommendedMovieModal = () => {
    setRecommendedMovie(undefined);
    setSelectedMovies([]);
  };

  return (
    <>
      <main className={styles.main}>
        {movies_groups.map((movies) => (
          <Row
            key={movies[0].id}
            movies={movies}
            selectedMovies={selectedMovies}
            onMovieClick={handleMovieClick}
          />
        ))}
      </main>
      <DetailedMovieModal
        movie={recommendedMovie}
        onClose={handleCloseRecommendedMovieModal}
      />
    </>
  );
};

export default Home;
