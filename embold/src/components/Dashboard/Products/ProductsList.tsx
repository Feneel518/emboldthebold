"use client";

import { Input } from "@/components/ui/input";
import { Product } from "@/types/Product";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import ProductsCard from "./ProductsCard";
import { Loader2 } from "lucide-react";
import { useIntersection } from "@mantine/hooks";
import { Separator } from "@/components/ui/separator";
import Loading from "@/components/Helpers/Loading";

interface ProductsListProps {
  products: Product[];
  initialProducts?: Product[];
}

export const dynamic = "force-dynamic";

const ProductsList: FC<ProductsListProps> = ({ products, initialProducts }) => {
  const [search, setSearch] = useState<string | null>(null);

  const lastProductRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastProductRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-dashboard-product"],
    async ({ pageParam = 1 }) => {
      const query = `/api/dashboard/product/fetchInfinite?limit=${4}&page=${pageParam}`;

      const response = await fetch(query, {
        cache: "no-cache",
      });

      const data = await response.json();

      return data.product as Product[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialProducts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const productss = data?.pages.flatMap((page) => page) ?? initialProducts;

  const filteredProduct = !search
    ? products
    : products?.filter((name) =>
        name.name.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <div>
      {/* top search */}
      <div className="mb-8">
        <Input
          value={search ? search : ""}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Products"
        ></Input>
      </div>
      {/* categories list */}
      {products?.length === 0 ? (
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl">No Products Found.</h1>
          <p className="text-xs">Please add new Product.</p>
        </div>
      ) : (
        <>
          <div
            className={`grid ${
              filteredProduct?.length === 0
                ? "grid-cols-1"
                : "lg:grid-cols-2 grid-cols-1"
            } gap-8 `}
          >
            {search ? (
              filteredProduct.map((fil) => {
                return (
                  <Link
                    href={`/dashboard/products/${fil?.slug}`}
                    key={fil?.id}
                    className="hover:shadow-lg hover:shadow-emboldLight/20 lg:p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out"
                  >
                    <ProductsCard product={fil!}></ProductsCard>
                  </Link>
                );
              })
            ) : productss?.length === 0 ? (
              <div className="text-center">No Products</div>
            ) : (
              productss?.map((product, index) => {
                if (index === productss?.length! - 1) {
                  return (
                    <Link
                      ref={ref}
                      href={`/dashboard/products/${product?.slug}`}
                      key={product?.id}
                      className="hover:shadow-lg hover:shadow-emboldLight/20 lg:p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out"
                    >
                      <ProductsCard product={product!}></ProductsCard>
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      href={`/dashboard/products/${product?.slug}`}
                      key={product?.id}
                      className="hover:shadow-lg hover:shadow-emboldLight/20 lg:p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out"
                    >
                      <ProductsCard product={product!}></ProductsCard>
                    </Link>
                  );
                }
              })
            )}
          </div>
          {isFetchingNextPage && (
            <div className="flex items-center justify-center grid-cols-2">
              <Loading></Loading>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsList;
