"use client";

import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/Product";
import { Heart } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";

import NewWishlistButton from "./NewWishlistButton";
import { useSession } from "next-auth/react";

interface ProductCardProps {
  product: Product;
  isCard?: boolean;
  isWishlist?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({ product, isCard, isWishlist }) => {
  let discount = 0;
  if (product.Inventory[0].discountedPrice === 0) {
    discount = 0;
  } else {
    discount = Math.round(
      ((product.Inventory[0].price - product.Inventory[0].discountedPrice) /
        product.Inventory[0].price) *
        100
    );
  }

  return (
    <>
      {/* ////////////////////////////////////////////////////////////// */}
      <div
        className={`group lg:hover:shadow-[5px_5px_rgba(19,_80,_91,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] transition-all duration-200 lg:file:hover:scale-105 bg-white hover:border w-full  p-2 relative rounded-md gap-2 items-center text-center justify-between flex flex-col text-xl text-white cursor-pointer h-[500px]
        `}
      >
        <Link
          href={`/product/${product.slug}`}
          className="w-full h-full flex flex-col items-center justify-between mb-2"
        >
          <div className="w-full h-[340px] overflow-hidden rounded-xl transition-all duration-300">
            <Image
              draggable={false}
              className="w-full h-full object-cover object-top rounded-xl lg:group-hover:scale-110 transition-all duration-300 ease-in-out"
              alt={product.name}
              src={product?.Image[0]?.url}
              width={247}
              height={340}
              sizes="(min-width: 808px) 50vw, 100vw"
              priority
              quality={75}
            ></Image>
          </div>
          <div className="items-start text-emboldBlack text-lg leading-5 ">
            {product.name}
          </div>
          <div
            className={`text-emboldBlack flex items-center  ${
              discount === 0 ? "" : "gap-6"
            }`}
          >
            <div
              className={`${
                discount === 0
                  ? "font-semibold "
                  : "text-gray-300 line-through text-sm"
              } `}
            >
              {formatPrice(product.Inventory[0].price)}
            </div>
            <div className=" font-semibold ">
              {discount === 0
                ? null
                : formatPrice(product.Inventory[0].discountedPrice)}
            </div>
            <div className="text-sm text-emerald-600 whitespace-nowrap">
              {discount === 0 ? null : `( - ${discount}.00%)`}
            </div>
          </div>
        </Link>
        <div className="text-emboldBlack w-full flex items-center justify-between gap-1 ">
          <AddToCartButton
            product={product.Inventory[0]}
            isCard={isCard}
          ></AddToCartButton>
          <NewWishlistButton
            isInWishlist={Boolean(product.WishlistOnProducts?.length)}
            id={product.id}
            isWishlistPage={isWishlist}
          ></NewWishlistButton>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
