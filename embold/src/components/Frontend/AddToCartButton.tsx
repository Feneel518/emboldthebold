"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CartItem, CartState, useCart } from "@/hooks/use-cart";
import { Product } from "@/types/Product";
import { Inventory } from "@/types/Inventory";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import axios from "axios";

interface AddToCartButtonProps {
  product: Inventory;
  isCard?: boolean;
  quantity?: number;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({
  product,
  isCard,
  quantity,
}) => {
  const pathname = usePathname();
  const { addItem, items, updateItem } = useCart();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isMax, setIsMax] = useState<boolean>(false);

  let cartProduct: Inventory;

  cartProduct = product;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  const handleAddToCart = () => {
    const itemsExist = items.find((el) => el.Inventory.id === cartProduct.id);

    const quantityValue = cartProduct.Quantity.quantity;

    if (!itemsExist) {
      addItem(cartProduct, 1);
      toast.success("Your Product has been added to the cart.", {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#13505B",
          color: "white",
          fontSize: "16px",
        },
      });
    }
    if (itemsExist) {
      const quantityCheck = itemsExist.Quantity;

      if (quantityCheck < quantityValue) {
        updateItem(cartProduct.id!, itemsExist.Quantity++);
        toast.success("Your Product has been added to the cart.", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#13505B",
            color: "white",
            fontSize: "16px",
          },
        });
      } else if (quantityCheck >= quantityValue) {
        toast.error(
          "The product got out of stock. Please check again after some time.",
          {
            className:
              "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            style: {
              backgroundColor: "#F07167",
              color: "white",
              fontSize: "16px",
            },
          }
        );
      }
    }
  };
  return (
    <Button
      disabled={quantity === 0}
      onClick={handleAddToCart}
      className="w-full"
      variant={pathname?.includes("product") ? "default" : "secondary"}
      size={"sm"}
    >
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
