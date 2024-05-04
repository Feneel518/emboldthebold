import Link from "next/link";
import { FC } from "react";
import { motion } from "framer-motion";

interface SideLinksProps {
  data: {
    href: string;
    title: string;
    index: number;
  };
}

const SideLinks: FC<SideLinksProps> = ({ data }) => {
  const slide = {
    initial: {
      x: "-80px",
    },
    enter: (i: number) => ({
      x: "0px",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
    }),
    exit: (i: number) => ({
      x: "-80px",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * i },
    }),
  };

  return (
    <motion.div
      custom={data.index}
      variants={slide}
      animate="enter"
      exit="exit"
      initial="initial"
      className=""
    >
      <Link href={data.href} className="text-gray-300">
        <h1 className="w-fit hover:scale-110 hover:text-embold transition-all duration-100 ease-in-out ">
          {data.title}
        </h1>
      </Link>
    </motion.div>
  );
};

export default SideLinks;
