import { useMemo } from "react";
import styles from "./scroll-handle.module.css";
import { ChevronThinRight, ChevronThinLeft } from "@styled-icons/entypo";

interface Props {
  position: "LEFT" | "RIGHT";
  onClick: () => void;
  disabled?: boolean;
}

const ScrollHandle: React.FC<Props> = (props) => {
  const { onClick, position, disabled } = props;

  const ArrowIcon = useMemo(() => {
    const color = disabled
      ? "rgba(255, 255, 255, .1)"
      : "rgba(255, 255, 255, .9)";

    switch (position) {
      case "LEFT":
        return <ChevronThinLeft color={color} height="100%" width="100%" />;
      case "RIGHT":
        return <ChevronThinRight color={color} height="100%" width="100%" />;
    }
  }, [position, disabled]);

  const className = `
    ${styles.scroll_handle} 
    ${
      position === "LEFT"
        ? styles.scroll_handle_left
        : styles.scroll_handle_right
    }
  `;

  return (
    <span onClick={onClick} className={className}>
      {ArrowIcon}
    </span>
  );
};

export default ScrollHandle;
