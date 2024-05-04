"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";
import ProductCard from "./ProductCard";
import { WishlistOnProducts } from "@/types/WishlistOnProducts";
import Empty from "../Helpers/Empty";
import MaxWidthWrapper from "../Utilities/MaxWidthWrapper";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { ChevronLeft } from "lucide-react";

interface WishlistPageProps {}

const WishlistPage: FC<WishlistPageProps> = ({}) => {
  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await axios.get("/api/wishlist/fetch");

      return data.wishlistOnProducts as WishlistOnProducts[];
    },
  });

  if (wishlist?.length === 0) {
    return (
      <div className="lg:my-20 my-10">
        <div className="mb-4 mt-10 flex items-center justify-center gap-4"></div>
        <div className="mt-4 text-emboldBlack/50 ">
          <MaxWidthWrapper>
            <Separator className="bg-emboldBlack"></Separator>
            <div className="flex w-full h-full items-center justify-center">
              <h1 className="text-2xl my-10">
                Sorry, there are no products in this wishlist.
              </h1>
            </div>
            <Link
              href={"/"}
              className={cn(
                buttonVariants({ variant: "linkBlack" }),
                "flex items-center gap-1"
              )}
            >
              <ChevronLeft className="w-4 h-4"></ChevronLeft> Go back to home
              page
            </Link>
          </MaxWidthWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
      {wishlist?.map((wish) => {
        return (
          <ProductCard
            key={wish.id}
            // @ts-ignore
            product={wish.Product}
            isCard={true}
            isWishlist={true}
          ></ProductCard>
        );
      })}
    </div>
  );
};

export default WishlistPage;
