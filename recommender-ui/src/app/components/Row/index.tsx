import { Movie } from "@/app/models/movie";
import Image from "next/image";
import styles from "./row.module.css";

interface Props {
  movies: Movie[];
}

const Row = (props: Props) => {
  const { movies } = props;

  return (
    <article className={styles.article}>
      {movies.map((movie) => (
        <Image
          key={movie.title}
          src={movie.img_url}
          alt={movie.title}
          width="0"
          height="0"
          sizes="100vw"
          style={{ height: "100%", width: "auto" }}
        />
      ))}
    </article>
  );
};

export default Row;
