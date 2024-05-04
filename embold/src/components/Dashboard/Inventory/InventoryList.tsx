"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/Product";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import ProductsCard from "../Products/ProductsCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/components/Helpers/Loading";

interface InventoryListProps {}

const InventoryList: FC<InventoryListProps> = ({}) => {
  const [search, setSearch] = useState<string>("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["dashboardInventory"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/inventory/fetch");
      return data.product as Product[];
    },
  });

  products?.map((item) =>
    item.Inventory.map((attr) =>
      attr.AttributesOnInventory.sort((a, b) =>
        a.attributeValue.attribute.name! > b.attributeValue.attribute.name!
          ? 1
          : -1
      )
    )
  );

  const filtered = products?.filter((name) =>
    name.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Loading></Loading>
      </div>
    );
  return (
    <div>
      <div className="mt-4 w-full text-emboldLight">
        <div className="item-center mx-auto mt-4 flex w-[90%] justify-center gap-2">
          <Input
            className=""
            type="text"
            placeholder="Search Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></Input>
          <Search className="mt-1 cursor-pointer" />
        </div>

        {products?.length === 0 ? (
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl">No Products Found.</h1>
            <p className="text-xs">Please add new Product.</p>
          </div>
        ) : (
          <div
            className={`grid ${
              filtered?.length === 0
                ? "grid-cols-1"
                : "lg:grid-cols-2 grid-cols-1"
            } gap-8 `}
          >
            {filtered?.length === 0 ? (
              <div className="text-center">No Categories</div>
            ) : (
              filtered?.map((product) => {
                return (
                  <Link
                    href={`/dashboard/products/${product.slug}`}
                    key={product.id}
                    className="hover:shadow-lg hover:shadow-emboldLight/20 lg:p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out"
                  >
                    <Card className="">
                      <CardContent className="p-2">
                        <div className="flex gap-2 lg:gap-8">
                          <div className="max-lg:w-1/2 ">
                            {product.Image[0] ? (
                              <Image
                                src={product.Image[0].url}
                                alt={
                                  product.Image[0].altText
                                    ? product.Image[0].altText
                                    : "product"
                                }
                                width={150}
                                height={200}
                                className="w-full h-[200px] object-cover rounded-lg lg:w-[150px]"
                              ></Image>
                            ) : (
                              <div className="text-9xl min-h-[200px] min-w-[150px] flex items-center justify-center border border-white/50 rounded-lg">
                                {product.name[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-between gap-8 w-1/2">
                            <div className="flex flex-col gap-2">
                              <h1 className="lg:text-lg">{product.name}</h1>
                            </div>
                            <div className="grid grid-cols-3 gap-4 py-4">
                              {product.Inventory.map((item) => {
                                return (
                                  <div className="flex items-center w-fit gap-4 rounded-lg bg-emboldLight px-2 py-1 text-emboldBlack">
                                    {item.AttributesOnInventory.map((attr) => (
                                      <div className="flex">
                                        <div className="">
                                          {attr.attributeValue.attribute
                                            .name === "size" &&
                                            attr.attributeValue.value}
                                        </div>
                                        <div className="">
                                          {attr.attributeValue.attribute
                                            .name === "colour" &&
                                            attr.attributeValue.name}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default InventoryList;
