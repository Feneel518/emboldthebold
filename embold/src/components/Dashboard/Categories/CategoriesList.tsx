"use client";

import { useQuery } from "@tanstack/react-query";
import { FC, useMemo, useState } from "react";
import axios from "axios";
import { Category } from "@/types/Category";
import CategoriesCard from "./CategoriesCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface CategoriesListProps {
  categories: Category[];
}

const CategoriesList: FC<CategoriesListProps> = ({ categories }) => {
  // const { data: categories, isLoading } = useQuery({
  //   queryKey: ["dashboardCategories"],
  //   queryFn: async () => {
  //     const { data } = await axios.get("/api/dashboard/categories/fetch");
  //     return data.categories as Category[];
  //   },
  // });

  const [search, setSearch] = useState<string | null>(null);

  const filteredCategory = !search
    ? categories
    : categories?.filter((name) =>
        name.name.toLowerCase().includes(search.toLowerCase())
      );

  // if (isLoading)
  //   return (
  //     <div className="flex w-full items-center justify-center gap-4 text-3xl mb-6">
  //       <Loader2 className="w-4 h-4 animate-spin"></Loader2> Loading...
  //     </div>
  //   );
  return (
    <div>
      {/* top search */}
      <div className="mb-8">
        <Input
          value={search ? search : ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Categories"
        ></Input>
      </div>
      {/* categories list */}
      {categories?.length === 0 ? (
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl">No Categories Found.</h1>
          <p className="text-xs">Please add new Categories to add</p>
        </div>
      ) : (
        <div
          className={`grid ${
            filteredCategory?.length === 0 ? "grid-cols-1" : "lg:grid-cols-2"
          } gap-8 `}
        >
          {filteredCategory?.length === 0 ? (
            <div className="text-center">No Categories</div>
          ) : (
            filteredCategory?.map((category) => {
              return (
                <Link
                  href={`/dashboard/categories/${category.slug}`}
                  key={category.id}
                  className="hover:shadow-lg hover:shadow-emboldLight/20 lg:p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out"
                >
                  <CategoriesCard {...category} />
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
