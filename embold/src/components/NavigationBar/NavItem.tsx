"use client";

import { FC } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Category } from "@/types/Category";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface NavItemProps {
  category: Category;
  handleOpen: () => void;
  handleClose: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}

const NavItem: FC<NavItemProps> = ({
  category,
  handleOpen,
  isAnyOpen,
  isOpen,
  handleClose,
}) => {
  return (
    <div className="flex ">
      <div className="relative flex items-center">
        {category.subCategory?.length !== 0 ? (
          <Button
            className=" p-0 px-2 gap-1 text-[15px] font-normal"
            onClick={handleOpen}
            variant={isOpen ? "secondary" : "navGhost"}
          >
            {category.name}
            {category.subCategory?.length !== 0 && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-all duration-150 text-gray-400",
                  {
                    "-rotate-180": isOpen,
                  }
                )}
              ></ChevronDown>
            )}
          </Button>
        ) : (
          <Link
            href={`/category/${category.slug}`}
            className={
              isOpen ? buttonVariants({ variant: "secondary" }) : "text-[15px]"
            }
          >
            {category.name}
          </Link>
        )}
      </div>
      {isOpen ? (
        <div
          className={cn("absolute inset-x-0 top-28 text-sm text-emboldBlack", {
            "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen,
          })}
        >
          <div
            className="absolute inset-0 top-1/2 bg-emboldLight50 shadow "
            aria-hidden="true"
          ></div>
          <div className="relative bg-emboldLight50">
            <Link
              onClick={handleClose}
              href={`/category/${category.slug}`}
              className={cn(
                "flex items-center absolute top-4 right-4 text-emboldBlack",
                buttonVariants({
                  variant: "link",
                  className: "text-emboldBlack",
                })
              )}
            >
              Go to {category.name}
              <ChevronRight className="w-4 h-4 "></ChevronRight>
            </Link>
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                  {category.subCategory?.map((subCate) => {
                    return (
                      <Link
                        onClick={handleClose}
                        href={`/category/${category.slug}?sub=${subCate.slug}`}
                        className="group relative text-base sm:text-sm"
                        key={subCate.id}
                      >
                        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                          {subCate.image ? (
                            <Image
                              alt={subCate.name}
                              src={subCate.image}
                              fill
                              className="object-cover object-top"
                            ></Image>
                          ) : (
                            <div className="text-9xl flex items-center justify-center h-full">
                              {subCate.name[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <h1 className="mt-6 block font-medium">
                          {subCate.name}
                        </h1>
                        <p className="mt-1">Shop now</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
