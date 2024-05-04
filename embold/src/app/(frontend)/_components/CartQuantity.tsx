"use client";

import { CartItem } from "@/hooks/use-cart";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FC, useState } from "react";

interface CartQuantityProps {
  quantity: number;
  setDecrease: () => void;
  setIncrease: () => void;
}

const CartQuantity: FC<CartQuantityProps> = ({
  quantity,
  setDecrease,
  setIncrease,
}) => {
  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        Quantity:
        <span>{quantity}</span>
        <div className="flex flex-col mt-1">
          <ChevronUp
            onClick={() => setIncrease()}
            className="w-4 h-4 cursor-pointer hover:bg-slate-100"
          ></ChevronUp>
          <ChevronDown
            onClick={() => setDecrease()}
            className="w-4 h- 4 cursor-pointer hover:bg-slate-100"
          ></ChevronDown>
        </div>
      </div>
    </div>
  );
};

export default CartQuantity;
