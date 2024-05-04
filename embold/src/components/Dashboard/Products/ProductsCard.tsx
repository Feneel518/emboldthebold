"use client";

import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Images } from "@/types/Image";
import { Product } from "@/types/Product";

interface ProductsCardProps {
  product: Product;
}

const ProductsCard: FC<ProductsCardProps> = ({ product }) => {
  return (
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
          {/* remove after donr */}

          <div className="flex flex-col justify-between gap-8 w-1/2">
            <div className="flex flex-col gap-2">
              <h1 className="lg:text-2xl">{product.name}</h1>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              {product.showOnHome && (
                <Badge className="w-fit" variant={"success"}>
                  Home Page
                </Badge>
              )}
              <div className="">
                {product.isActive ? (
                  <Badge variant={"success"}>Active</Badge>
                ) : (
                  <Badge variant={"destructive"}>Draft</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsCard;
