"use client";

import { FC, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SideMenu from "./SideMenu";

interface SideBarProps {}

const SideBar: FC<SideBarProps> = ({}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div
      onClick={() => setIsActive(!isActive)}
      className="fixed left-0 m-2 w-20 h-20 bg-emboldBlack rounded-full flex items-center justify-center cursor-pointer z-50"
    >
      <div
        className={`${
          isActive
            ? "   before:rotate-45 after:-rotate-45 after:-top-[1px] before:top-[1px] "
            : ""
        } before:transition-all before:duration-300  after:transition-all after:duration-300   w-full after:content-[''] before:content-[''] before:block after:block  before:relative after:relative before:w-[40%] after:w-[40%] before:bg-white after:bg-white before:h-0.5 after:h-0.5 before:m-auto after:m-auto after:-top-1.5 before:top-1.5`}
      >
        <AnimatePresence mode="wait">
          {isActive && <SideMenu></SideMenu>}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SideBar;
