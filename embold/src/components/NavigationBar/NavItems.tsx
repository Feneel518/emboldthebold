"use client";

import { Category } from "@/types/Category";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Skeleton } from "../ui/skeleton";

interface NavItemsProps {}

const NavItems: FC<NavItemsProps> = ({}) => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  const { data: categories, isLoading: loadingData } = useQuery({
    queryKey: ["NavbarCategories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/categories/fetchNavbar");
      return data.categories as Category[];
    },
  });

  const isAnyOpen = activeIndex !== null;

  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => setActiveIndex(null));

  if (!categories) return;

  return (
    <div className="flex gap-x-16 h-full flex-wrap justify-center" ref={navRef}>
      {categories.map((cate, i) => {
        const handleOpen = () => {
          if (activeIndex === i) setActiveIndex(null);
          else {
            setActiveIndex(i);
          }
        };

        const handleClose = () => {
          setActiveIndex(null);
        };

        const isOpen = i === activeIndex;
        return (
          !cate.parentId && (
            <NavItem
              category={cate}
              handleOpen={handleOpen}
              isOpen={isOpen}
              isAnyOpen={isAnyOpen}
              key={cate.id}
              handleClose={handleClose}
            ></NavItem>
          )
        );
      })}
    </div>
  );
};

export default NavItems;
