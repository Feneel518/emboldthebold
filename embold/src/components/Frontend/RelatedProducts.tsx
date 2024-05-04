"use client";

import { FC } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import ProductCard from "./ProductCard";
import { Product } from "@/types/Product";
interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: FC<RelatedProductsProps> = ({ products }) => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <div className=" mt-[50px] md:mb-0 md:mt-[100px] mx-10">
      <div className="-ml-12 mb-5 text-2xl font-bold max-lg:text-center">
        You Might Also Like
      </div>

      <Carousel
        containerClass="lg:-mx-[100px]"
        itemClass="p-4"
        responsive={responsive}
      >
        {products.map((prod) => {
          return <ProductCard key={prod.id} product={prod} />;
        })}
      </Carousel>
    </div>
  );
};

export default RelatedProducts;
