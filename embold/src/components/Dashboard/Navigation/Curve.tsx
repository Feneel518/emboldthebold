import { FC } from "react";
import { motion } from "framer-motion";

interface CurveProps {}

const Curve: FC<CurveProps> = ({}) => {
  const initialPath = `M0 0 L0 ${window.innerHeight} Q100 ${
    window.innerHeight / 2
  } 0 0 `;
  const targetPath = `M0 0 L0 ${window.innerHeight} Q0 ${
    window.innerHeight / 2
  } 0 0 `;

  const pathAnimation = {
    initial: {
      d: initialPath,
    },
    enter: {
      d: targetPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: initialPath,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
    },
  };
  return (
    <svg className="absolute top-0 right-[-99px] w-[100px] h-full fill-emboldBlack stroke-none">
      <motion.path
        variants={pathAnimation}
        initial="initial"
        animate="enter"
        exit="exit"
        d={targetPath}
      ></motion.path>
    </svg>
  );
};

export default Curve;
