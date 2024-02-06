'use client';
import { createPortal } from "react-dom";
import { Grid } from "react-loader-spinner";
import styles from "./loader.module.css";

const Loader = () => {
  return createPortal(
    <main className={styles.container}>
      <Grid
        visible={true}
        height="10rem"
        width="10rem"
        color="rgba(255, 255,255, .8)"
        ariaLabel="grid-loading"
        wrapperStyle={{}}
        wrapperClass="grid-wrapper"
      />
    </main>,
    document.body
  );
};

export default Loader;
