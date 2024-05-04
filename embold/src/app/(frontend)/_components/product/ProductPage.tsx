"use client";

import AddToCartButton from "@/components/Frontend/AddToCartButton";
import EditorOutput from "@/components/Frontend/EditorOutput";
import NewWishlistButton from "@/components/Frontend/NewWishlistButton";
import ProductDetailsCarousel from "@/components/Frontend/ProductDetailsCarousel";
import RelatedProducts from "@/components/Frontend/RelatedProducts";
import SizeModal from "@/components/Helpers/SizeModal";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/Product";
import { redirect, useRouter } from "next/navigation";
import { FC, useState } from "react";

interface ProductPageProps {
  product: Product;
  relatedProducts?: Product[];
  slug: string;
}

const ProductPage: FC<ProductPageProps> = ({ product, relatedProducts }) => {
  if (!product) redirect("/");

  const [selectedSize, setSelectedSize] = useState<string>(
    product.size[0].replace(/ /g, "")
  );

  const [selectedColour, setSelectedColour] = useState<{
    label: string;
    value: string;
  }>(product.colour[0]);

  product.Inventory.map((attr) =>
    attr.AttributesOnInventory.sort((a, b) =>
      a.attributeValueId > b.attributeValueId ? 1 : -1
    )
  );

  const productAttribute = product.Inventory.filter(
    (attr) =>
      attr.AttributesOnInventory[1].attributeValueId === selectedSize &&
      attr.AttributesOnInventory[0].attributeValueId === selectedColour?.value
  );

  let discount: number = 0;
  if (
    productAttribute.length > 0 &&
    product.Inventory[0].discountedPrice !== 0
  ) {
    discount = Math.floor(
      ((productAttribute[0].price - productAttribute[0].discountedPrice) /
        productAttribute[0].price) *
        100
    );
  }

  return (
    <div className="xl:mt-20 -mt-10">
      <div className="flex flex-col lg:flex-row md:px-10 gap-[20px] lg:gap-[100px] mt-10">
        {/* left column */}
        <div className=" w-full md:w-auto flex-[1] lg:max-w-full ">
          <ProductDetailsCarousel
            images={product.Image}
            name={product.name}
          ></ProductDetailsCarousel>
        </div>
        {/* right column */}
        <div className=" flex-[1.5] py-3 mt-16">
          <div className="">
            <h1 className="text-3xl md:text-5xl">{product.name}</h1>
          </div>
          <div className="mt-10 rounded-md   ">
            <h2 className="mb-4 text-xl font-bold underline underline-offset-4">
              Product Description
            </h2>
            <EditorOutput description={product.description}></EditorOutput>
          </div>
          {/* prices */}
          <div className="mt-8 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold lg:text-2xl">
                {productAttribute.length > 0 && (
                  <div className="">
                    {productAttribute[0].discountedPrice === 0 ? (
                      <div className="">
                        {" "}
                        {formatPrice(productAttribute[0].price)}
                      </div>
                    ) : (
                      <div className="flex items-end gap-4">
                        <div className="">
                          {formatPrice(productAttribute[0].discountedPrice)}
                          .00
                        </div>
                        <div className="font-normal text-emboldLight line-through">
                          {formatPrice(productAttribute[0].price)}
                        </div>
                        <div className="mb-1 text-sm font-semibold text-embold">
                          {"("} {discount} % OFF {")"}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-lg font-semibold text-embold">
              Free Shipping and inclusive of all taxes
            </div>
          </div>

          <div className="mt-8 lg:mt-16">
            <div className="flex items-center justify-between text-lg">
              <div className="font-semibold">Select Size</div>
              <div className="">
                <SizeModal></SizeModal>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {product.size.map((size, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedSize(size.replace(/ /g, ""));
                    }}
                    className={`cursor-pointer border  h-12 w-12  rounded-full py-3 text-center font-medium hover:border-black ${
                      selectedSize === size.replace(/ /g, "")
                        ? productAttribute[0].Quantity.quantity === 0
                          ? "border-gray-400 bg-gray-400 text-emboldBlack/50 "
                          : "border-black bg-emboldBlack text-emboldLight"
                        : " "
                    }`}
                  >
                    {size}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8">
            <div className=" text-lg">
              <div className="font-semibold">Select Colour</div>
            </div>
            <div className="flex gap-2">
              {product.colour.map((col, index) => {
                const style = {
                  background: col.value,
                };

                return (
                  <div
                    key={index}
                    className={`${
                      selectedColour?.value === col.value ? "border" : ""
                    }  flex h-12 w-12 items-center justify-center rounded-full border-black duration-75 ease-in-out transition-all hover:scale-110 hover:border`}
                  >
                    <div
                      onClick={() => {
                        setSelectedColour(col);
                      }}
                      style={style}
                      className={` h-10 w-10 cursor-pointer rounded-full`}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
          {productAttribute[0]?.Quantity.quantity === 0 && (
            <div className="mt-2 text-sm text-red-600">
              The selected size and colour is out of stock.
            </div>
          )}
          <div className="mt-10 grid grid-cols-2  gap-4 ">
            <AddToCartButton
              product={productAttribute[0]}
              isCard={false}
              quantity={productAttribute[0].Quantity.quantity}
            ></AddToCartButton>
            <NewWishlistButton
              id={product.id}
              isInWishlist={Boolean(product.WishlistOnProducts.length)}
              isProductPage={true}
            ></NewWishlistButton>
          </div>
        </div>
      </div>
      {relatedProducts?.length !== 0 && (
        <div className="">
          <RelatedProducts products={relatedProducts!}></RelatedProducts>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
