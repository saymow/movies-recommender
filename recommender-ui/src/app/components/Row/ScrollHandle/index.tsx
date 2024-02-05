import styles from "./scroll-handle.module.css";

interface Props {
  position: "LEFT" | "RIGHT";
  onClick: () => void;
  disabled?: boolean;
}

const ScrollHandle: React.FC<Props> = (props) => {
  const { onClick, position, disabled } = props;

  const className = `
    ${styles.scroll_handle} 
    ${
      position === "LEFT"
        ? styles.scroll_handle_left
        : styles.scroll_handle_right
    }
    ${disabled ? styles.scroll_handle_disabled : ""}
  `;

  return <span onClick={onClick} className={className}></span>;
};

export default ScrollHandle;
