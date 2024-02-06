"use client";
import { Grid } from "react-loader-spinner";
import styles from "./loader.module.css";

const Loader = () => {
  return (
    <main className={styles.container}>
      <Grid
        visible={true}
        height="10rem"
        width="10rem"
        color="rgba(255, 255,255, .8)"
        ariaLabel="grid-loading"
      />
    </main>
  );
};

export default Loader;
