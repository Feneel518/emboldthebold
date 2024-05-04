"use client";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Inventory } from "@/types/Inventory";
import { X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { Input } from "../ui/input";
import CartQuantity from "@/app/(frontend)/_components/CartQuantity";

interface CartItemProps {
  product: Inventory;
  quantity: number;
}

const CartItem: FC<CartItemProps> = ({ product, quantity }) => {
  const {
    removeItem,
    updateItem,
    items,
    increaseItemQuantity,
    decreaseItemQuantity,
  } = useCart();

  let discount: number = 0;
  if (product.discountedPrice !== 0) {
    discount = Math.floor(
      ((product.price - product.discountedPrice) / product.price) * 100
    );
  }

  const itemsExist = items.find((el) => el.Inventory.id === product.id);

  if (!itemsExist) return;

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-clip rounded">
            <Image
              src={product.Product?.Image[0]?.url}
              alt={product.Product.name}
              fill
              quality={50}
              className="absolute object-cover object-top"
            ></Image>
          </div>
          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {/* {product.Product.name} */}
              {product?.Product.name}
            </span>
            <span className=" text-sm font-medium mb-1 flex gap-4   ">
              {/* {product.Product.name} */}
              {product.AttributesOnInventory.sort((a, b) =>
                a.attributeValueId > b.attributeValueId ? 1 : -1
              ).map((attr, index) => {
                return (
                  <div className="" key={attr.id}>
                    {index === 0
                      ? attr.attributeValue.name
                      : attr.attributeValue.value}
                  </div>
                );
              })}
            </span>
            <div className=" text-sm font-medium mb-1 flex gap-4 items-center  ">
              <CartQuantity
                quantity={itemsExist.Quantity}
                setDecrease={() => {
                  if (itemsExist.Quantity <= 1) {
                    updateItem(itemsExist.Inventory.id!, 1);
                  } else {
                    decreaseItemQuantity(itemsExist.Inventory.id!);
                  }
                }}
                setIncrease={() => {
                  if (
                    itemsExist.Quantity >=
                    itemsExist.Inventory.Quantity.quantity
                  ) {
                    updateItem(
                      itemsExist.Inventory.id!,
                      itemsExist.Inventory.Quantity.quantity
                    );
                  } else {
                    increaseItemQuantity(itemsExist.Inventory.id!);
                  }
                }}
              ></CartQuantity>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          {product.discountedPrice === 0 ? (
            <span className="ml-auto line-clamp-1 text-sm">
              {formatPrice(product.price * quantity)}
            </span>
          ) : (
            <>
              <span className="ml-auto line-clamp-1 text-sm">
                {formatPrice(product.discountedPrice * quantity)}
              </span>
              <span className="ml-auto line-clamp-1 text-sm line-through text-emboldBlack/60">
                {formatPrice(product.price * quantity)}
              </span>
              <span className="ml-auto whitespace-nowrap ">
                {discount === 0 ? (
                  ""
                ) : (
                  <div className="mb-1 text-xs  font-semibold text-embold">
                    {"("} - {discount}.00 % {")"}
                  </div>
                )}
              </span>
            </>
          )}
          <div className="mt-1 text-xs text-emboldBlack/50">
            <button
              onClick={() => removeItem(product.id!)}
              className="flex items-center gap-0.5"
            >
              <X className="w-3 h-3"></X>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
