"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Row from "./components/Row";
import { Movie } from "./models/movie";
import styles from "./page.module.css";

type SelectedMovies = string[];

const TOTAL_MOVIES_SELECT = 3;

const get_movies = async (): Promise<Movie[]> => {
  const response = await fetch("http://localhost:3000/api/movies");
  const data: Movie[] = await response.json();

  return data.map((movie) => ({
    ...movie,
    img_url: `https://${movie.img_url}`,
  }));
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

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<SelectedMovies>([]);
  const movies_groups = useMemo(
    () => (movies.length ? create_movies_groups(movies) : []),
    [movies]
  );

  useEffect(() => {
    get_movies().then((data) => {
      setMovies(data);
    });
  }, []);

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

  return (
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
  );
};

export default Home;
