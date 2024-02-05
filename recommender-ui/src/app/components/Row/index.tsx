"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Movie } from "@/app/models/movie";
import Image from "next/image";
import styles from "./row.module.css";

interface Props {
  movies: Movie[];
  onMovieClick: (movieId: string) => void;
  selectedMovies: string[];
}

enum ViewScroll {
  LETT,
  RIGHT,
}

const Row = (props: Props) => {
  const { movies, selectedMovies, onMovieClick } = props;
  const [viewScroll, setViewScroll] = useState<ViewScroll>(ViewScroll.LETT);
  const firstMovieRef = useRef<HTMLImageElement>(null);
  const lastMovieRef = useRef<HTMLImageElement>(null);
  const Movies = useMemo(() => {
    const firstMovie = movies[0];
    const lastMovie = movies[movies.length - 1];

    return [
      <Image
        ref={firstMovieRef}
        key={firstMovie.id}
        src={firstMovie.img_url}
        alt={firstMovie.title}
        className={`${styles.movie_card} ${
          selectedMovies.includes(firstMovie.id)
            ? styles.selected_movie_card
            : ""
        }`}
        onClick={() => onMovieClick(firstMovie.id)}
        width="0"
        height="0"
        sizes="100vw"
        style={{ height: "100%", width: "auto" }}
      />,
      ...movies
        .slice(1, movies.length - 1)
        .map((movie) => (
          <Image
            key={movie.id}
            src={movie.img_url}
            alt={movie.title}
            className={`${styles.movie_card} ${
              selectedMovies.includes(movie.id)
                ? styles.selected_movie_card
                : ""
            }`}
            onClick={() => onMovieClick(movie.id)}
            width="0"
            height="0"
            sizes="100vw"
            style={{ height: "100%", width: "auto" }}
          />
        )),
      <Image
        ref={lastMovieRef}
        key={lastMovie.id}
        src={lastMovie.img_url}
        alt={lastMovie.title}
        className={`${styles.movie_card} ${
          selectedMovies.includes(lastMovie.id)
            ? styles.selected_movie_card
            : ""
        }`}
        onClick={() => onMovieClick(lastMovie.id)}
        width="0"
        height="0"
        sizes="100vw"
        style={{ height: "100%", width: "auto" }}
      />,
    ];
  }, [movies, onMovieClick, selectedMovies]);

  useEffect(() => {
    if (viewScroll === ViewScroll.LETT) {
      firstMovieRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      lastMovieRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [viewScroll]);

  const handleScrollLeft = () => {
    setViewScroll(ViewScroll.LETT);
  };

  const handleScrollRight = () => {
    setViewScroll(ViewScroll.RIGHT);
  };

  return (
    <article className={styles.article}>
      <span
        onClick={handleScrollLeft}
        className={`${styles.scroll_handle} ${styles.scroll_handle_left} ${
          viewScroll === ViewScroll.LETT ? styles.scroll_handle_disabled : ""
        }`}
      ></span>
      <section className={styles.section_container}>{Movies}</section>
      <span
        onClick={handleScrollRight}
        className={`${styles.scroll_handle} ${styles.scroll_handle_right} ${
          viewScroll === ViewScroll.RIGHT ? styles.scroll_handle_disabled : ""
        }`}
      ></span>
    </article>
  );
};

export default Row;
