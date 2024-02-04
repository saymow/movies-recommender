import Row from "./components/Row";
import { Movie } from "./models/movie";
import styles from "./page.module.css";

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

const Home: React.FC = async () => {
  const movies = await get_movies();
  const movies_groups = create_movies_groups(movies);

  return (
    <main className={styles.main}>
      {movies_groups.map((movies) => (
        <Row key={movies[0].title} movies={movies} />
      ))}
    </main>
  );
};

export default Home;
