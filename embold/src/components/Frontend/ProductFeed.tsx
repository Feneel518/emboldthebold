import { db } from "@/lib/db";
import { FC } from "react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import {
  CategoryName,
  ProductFromCategoriesWithLimit,
} from "../Utilities/FetchDatas";
import ProductCard from "./ProductCard";

interface ProductFeedProps {
  id: string | null;
}

const ProductFeed: FC<ProductFeedProps> = async ({ id }) => {
  if (!id) return null;

  const data = await Promise.all([
    CategoryName(id),
    ProductFromCategoriesWithLimit(id, 5),
  ]);

  const categoryName = data[0];
  const products = data[1];

  if (products.length === 0) return null;
  return (
    <div className="pb-10 border-b justify-start">
      <div className="flex items-center justify-between">
        <h1 className=" ml-2 text-3xl font-bold lg:ml-6">
          {categoryName?.name}
        </h1>
        <Link
          href={`/category/${categoryName?.slug}`}
          className={`${buttonVariants({
            variant: "linkBlack",
          })} cursor-pointer text-right whitespace-nowrap`}
        >
          See More...
        </Link>
      </div>

      <div className="grid grid-cols-2  md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {products?.map((prod) => {
          return (
            <ProductCard
              key={prod.id}
              // @ts-ignore
              product={prod}
              isCard={true}
            ></ProductCard>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFeed;
