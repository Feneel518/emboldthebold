"use client";

import { FC } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/Category";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

interface CategoryListProps {}

const CategoryList: FC<CategoryListProps> = ({}) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["limitedCategories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/categories/fetchLimit");
      return data.categories as Category[];
    },
  });

  if (isLoading)
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
      </div>
    );

  if (categories?.length === 3) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
        {categories.map((cate, index) => {
          return (
            <Link
              key={cate.id}
              href={`/category/${cate.slug}`}
              className={`group relative z-30 mx-auto flex items-center justify-center overflow-hidden bg-cover bg-no-repeat shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] ${
                index === 1
                  ? " lg:col-span-2 col-span-1"
                  : index === 0
                  ? "lg:col-span-1 col-span-2"
                  : ""
              } `}
            >
              <div className="overflow-hidden ">
                <Image
                  className={`cursor-pointer object-cover h-[300px] lg:h-[415px] object-top rounded-lg `}
                  src={cate.image!}
                  alt={cate.name}
                  width={320}
                  height={415}
                ></Image>
                <div className="absolute bottom-0 z-40 hidden h-full w-full items-center justify-center bg-emboldLight/20 opacity-0 duration-300 transition-all group-hover:bottom-0 group-hover:opacity-100 max-lg:hover:scale-105 lg:-bottom-10 lg:flex">
                  <Button
                    variant="outline"
                    className="pointer-events-none absolute h-28 w-28 rounded-full"
                  >
                    {cate.name}
                  </Button>
                </div>
                <div className=" absolute bottom-0 z-40 hidden h-full w-full items-end  justify-center  max-lg:flex ">
                  <Button
                    variant="outline"
                    className=" pointer-events-none absolute w-[90%] bg-opacity-50 text-sm"
                  >
                    {cate.name}
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
  if (categories?.length === 5) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-8">
        {categories.map((cate, index) => {
          return (
            <Link
              key={cate.id}
              href={`/category/${cate.slug}`}
              className={`group relative z-30 mx-auto flex items-center justify-center overflow-hidden bg-cover bg-no-repeat shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] ${
                index === 1
                  ? " lg:col-span-2 col-span-1"
                  : index === 0
                  ? "lg:col-span-1 col-span-2"
                  : index === 3
                  ? "lg:col-span-2"
                  : index === 4
                  ? "lg:col-span-2"
                  : ""
              } `}
            >
              <div className="overflow-hidden ">
                <Image
                  className={`cursor-pointer object-cover h-[300px] lg:h-[415px] object-top rounded-lg `}
                  src={cate.image!}
                  alt={cate.name}
                  width={320}
                  height={415}
                  quality={50}
                ></Image>
                <div className="absolute bottom-0 z-40 hidden h-full w-full items-center justify-center bg-emboldLight/20 opacity-0 duration-300 transition-all group-hover:bottom-0 group-hover:opacity-100 max-lg:hover:scale-105 lg:-bottom-10 lg:flex">
                  <Button
                    variant="outline"
                    className="pointer-events-none absolute h-28 w-28 rounded-full"
                  >
                    {cate.name}
                  </Button>
                </div>
                <div className=" absolute bottom-0 z-40 hidden h-full w-full items-end  justify-center  max-lg:flex ">
                  <Button
                    variant="outline"
                    className=" pointer-events-none absolute w-[90%] bg-opacity-50 text-sm"
                  >
                    {cate.name}
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
  if (categories?.length === 4 || categories?.length === 6) {
    return (
      <div
        className={`grid grid-cols-2  gap-3 lg:gap-8 ${
          categories.length === 6 ? "grid-cols-3" : "lg:grid-cols-4"
        }`}
      >
        {categories.map((cate, index) => {
          return (
            <Link
              key={cate.id}
              href={`/category/${cate.slug}`}
              className={`group relative z-30 mx-auto flex items-center justify-center overflow-hidden bg-cover bg-no-repeat shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]  `}
            >
              <div className="overflow-hidden ">
                <Image
                  className={`cursor-pointer object-cover h-[200px] lg:h-[415px] object-top rounded-lg `}
                  src={cate.image!}
                  alt={cate.name}
                  width={320}
                  height={415}
                  quality={50}
                ></Image>
                <div className="absolute bottom-0 z-40 hidden h-full w-full items-center justify-center bg-emboldLight/20 opacity-0 duration-300 transition-all group-hover:bottom-0 group-hover:opacity-100 max-lg:hover:scale-105 lg:-bottom-10 lg:flex">
                  <Button
                    variant="outline"
                    className="pointer-events-none absolute h-28 w-28 rounded-full"
                  >
                    {cate.name}
                  </Button>
                </div>
                <div className=" absolute bottom-0 z-40 hidden h-full w-full items-end  justify-center  max-lg:flex ">
                  <Button
                    variant="outline"
                    className=" pointer-events-none absolute w-[90%] bg-opacity-50 text-sm"
                  >
                    {cate.name}
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return <div className="">No Categories</div>;
};

export default CategoryList;
