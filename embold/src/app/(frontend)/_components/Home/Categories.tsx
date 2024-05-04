import CategoryList from "@/components/Frontend/CategoryList";
import { db } from "@/lib/db";
import { FC } from "react";

interface CategoriesProps {}

export const revalidate = 0;
export const dynamic = "force-dynamic";

const Categories: FC<CategoriesProps> = async ({}) => {
  return (
    <div className="relative">
      <div className="flex flex-col pb-10">
        <h1 className="text-center text-3xl">Top Categories</h1>
      </div>
      <CategoryList></CategoryList>
    </div>
  );
};

export default Categories;
