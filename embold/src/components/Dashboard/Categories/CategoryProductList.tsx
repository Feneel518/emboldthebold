"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FC, useState } from "react";
import ProductsCard from "../Products/ProductsCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@/types/Product";
import Link from "next/link";

interface CategoryProductListProps {
  products: Product[];
}

const CategoryProductList: FC<CategoryProductListProps> = ({ products }) => {
  const [search, setSearch] = useState<string>("");

  const filtered = products?.filter((name) =>
    name.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Card className="flex-1 bg-emboldBlack p-4">
        <CardHeader>
          <div className="">
            <h1 className="text-2xl text-white">Category Products List</h1>
          </div>
        </CardHeader>
        <CardContent>
          {products !== undefined && products?.length !== 0 && (
            <div className=" rounded-xl bg-emboldBlack ">
              <div className=" mx-auto flex item-center justify-center gap-4">
                <Input
                  className=""
                  type="text"
                  placeholder="Search Categories"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                ></Input>
                <Search className=" cursor-pointer text-emboldLight  mt-2" />
              </div>
              <div className=" grid grid-cols-2 content-center items-center justify-center gap-2 max-sm:gap-4 sm:grid-cols-2  md:grid-cols-3 mt-4">
                {filtered.map((product) => {
                  return (
                    <Link
                      key={product.id}
                      href={`/dashboard/products/${product.slug}`}
                    >
                      <ProductsCard product={product}></ProductsCard>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryProductList;
