import { FC, useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

import { Icons } from "../Utilities/Icons";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "../ui/scroll-area";
import CartItem from "./CartItem";
import { useSession } from "next-auth/react";

interface CartProps {}

const Cart: FC<CartProps> = ({}) => {
  const { data: Session } = useSession();
  const { items } = useCart();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const itemCount = items.length;

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, val) =>
        total +
        (val.Inventory.discountedPrice === 0
          ? val.Inventory.price * val.Quantity
          : val.Inventory.discountedPrice * val.Quantity),
      0
    );
  }, [items]);

  return (
    // <div className=""></div>
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-emboldBlack/70 group-hover:text-emboldBlack"
        ></ShoppingCart>
        <span className="ml-2 text-sm font-medium text-emboldBlack/70 group-hover:text-emboldBlack">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="bg-white text-emboldBlack flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6 text-emboldBlack">
          <SheetTitle className="text-emboldBlack">
            Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6 overflow-y-scroll scroll-ml-2">
              <div className="pr-2">
                <ScrollArea>
                  {items.map((item, index) => {
                    return (
                      <CartItem
                        key={index}
                        product={item.Inventory}
                        quantity={item.Quantity}
                      ></CartItem>
                    );
                  })}
                </ScrollArea>
              </div>
            </div>
            <div className="space-y-4 pr-6">
              <Separator></Separator>
              <div className="spacee-y-1.5 text-sm">
                <div className="flex ">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex ">
                  <span className="flex-1">Total</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  {Session?.user ? (
                    <Link
                      href="/cart"
                      className={buttonVariants({ className: "w-full" })}
                    >
                      Continue to Checkout
                    </Link>
                  ) : (
                    <Link
                      href="/sign-in?origin=cart"
                      className={buttonVariants({ className: "w-full" })}
                    >
                      Sign in to checkout
                    </Link>
                  )}
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center ">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-emboldBlack/70 flex flex-col space-y-4 items-center justify-center"
            >
              <Icons.EmptyCart className="h-60 w-60"></Icons.EmptyCart>
              <div className="text-xl font-semibold text-center">
                Yout cart is empty
              </div>
              <SheetTrigger asChild>
                <Link
                  href={"/products"}
                  className={buttonVariants({
                    variant: "linkBlack",
                    size: "sm",
                    className: "text-sm text-center",
                  })}
                >
                  Add items to your cart to checkout
                </Link>
              </SheetTrigger>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
