import { Movie } from "@/app/models/movie";
import Image from "next/image";
import Modal from "../Modal";
import styles from "./detailed-movie-modal.module.css";

interface Props {
  movie?: Movie;
  onClose: () => void;
}

const printList = (list: string[]) => {
  if (list.length === 1) {
    return list[0];
  }
  if (list.length === 2) {
    return `${list[0]} and ${list[1]}`;
  }
  if (list.length === 3) {
    return `${list[0]}, ${list[1]} and ${list[2]}`;
  }

  return list.join(", ");
};

const DetailedMovieModal: React.FC<Props> = (props) => {
  const { movie, onClose } = props;

  return (
    <Modal isOpen={!!movie} onClose={onClose}>
      {movie && (
        <section className={styles.container}>
          <article className={styles.main_content}>
            <Image
              src={movie.img_url}
              alt={movie.title}
              width={185 * 1.2}
              height={278 * 1.2}
            />
            <section className={styles.movie_description}>
              <h2>{movie.title}</h2>
              <p>{movie.summary}</p>
              <footer>
                <p>
                  <strong>Directors:</strong> {printList(movie.directors)}
                </p>
                <p>
                  <strong>Genres:</strong> {printList(movie.genres)}
                </p>
                <p>
                  <strong>Rating:</strong> {movie.avg_rating.toFixed(2)}
                </p>
              </footer>
            </section>
          </article>
          <article className={styles.trailers_container}>
            <h3>Trailers</h3>
            <section className={styles.trailers_list}>
              {movie.trailer_videos_ids.map((video_id) => (
                <iframe
                  key={video_id}
                  width={550 * 0.6}
                  height={300 * 0.6}
                  src={`http://www.youtube.com/embed/${video_id}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ))}
            </section>
          </article>
        </section>
      )}
    </Modal>
  );
};

export default DetailedMovieModal;
