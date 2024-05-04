"use client";

import AddressModal from "@/components/Helpers/AddressModal";
import Loading from "@/components/Helpers/Loading";
import { Icons } from "@/components/Utilities/Icons";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useMemo, useState } from "react";
import CartQuantity from "../../_components/CartQuantity";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { data: Session } = useSession();

  const {
    items,
    removeItem,
    updateItem,
    increaseItemQuantity,
    decreaseItemQuantity,
  } = useCart();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  items.map((item) =>
    item.Inventory.AttributesOnInventory.sort((a, b) =>
      a.attributeValue.value > b.attributeValue.value ? 1 : -1
    )
  );

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, val) => total + val.Inventory.price * val.Quantity,
      0
    );
  }, [items]);

  const savings = useMemo(() => {
    return items.reduce(
      (total, val) =>
        total +
        (val.Inventory.discountedPrice === 0
          ? 0
          : (val.Inventory.price - val.Inventory.discountedPrice) *
            val.Quantity),
      0
    );
  }, [items]);

  return (
    <>
      {isMounted ? (
        <MaxWidthWrapper>
          <div className="bg-white">
            <div className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Shopping Cart
              </h1>
              <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                <div
                  className={cn("lg:col-span-7", {
                    "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                      isMounted && items.length === 0,
                  })}
                >
                  <h2 className="sr-only">Items in your shopping cart</h2>
                  {isMounted && items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-1">
                      <div
                        className="relative mb-4 h-40 w-40  flex "
                        aria-hidden={true}
                      >
                        <Icons.EmptyCart className="w-40 h-40"></Icons.EmptyCart>
                      </div>
                      <h3 className="font-semibold text-2xl">
                        Your cart is empty.
                      </h3>
                      <div className="text-emboldBlack/60">
                        Whoops! Nothing to show here yet
                      </div>
                    </div>
                  ) : null}
                  <ul
                    className={cn({
                      "divide-y divide-gray-200 border-b border-t border-gray-200":
                        isMounted && items.length > 0,
                    })}
                  >
                    {isMounted &&
                      items.map((item) => {
                        let discount: number = 0;
                        if (item.Inventory.discountedPrice !== 0) {
                          discount = Math.floor(
                            ((item.Inventory.price -
                              item.Inventory.discountedPrice) /
                              item.Inventory.price) *
                              100
                          );
                        }

                        return (
                          <li
                            key={item.Inventory.id}
                            className="flex py-6 sm:py-10 items-center lg:flex-row flex-col"
                          >
                            <div className="flex-shrink-0">
                              <div className="relative h-44 w-32 max-lg:h-48 max-lg:w-28">
                                <Image
                                  src={item.Inventory.Product.Image[0].url}
                                  alt={item.Inventory.Product.name}
                                  fill
                                  className="object-cover object-top h-full w-full rounded-md sm:h-48 sm:w-48"
                                ></Image>
                              </div>
                            </div>

                            <div className="ml-4 flex flex-1 w-full flex-col  justify-between sm:ml-6 max-lg:mt-4">
                              <div className="relative w-full pr-4 sm:pr-0">
                                <div className="flex flex-col gap-4 ">
                                  <div className="flex justify-between">
                                    <h3 className="text-sm">
                                      <Link
                                        className="font-medium text-gray-700 hover:text-gray-800 text-xl "
                                        href={`/product/${item.Inventory.Product.slug}`}
                                      >
                                        {item.Inventory.Product.name}
                                      </Link>
                                    </h3>
                                  </div>
                                  <div className="mt-1 flex text-sm  lg:gap-4 flex-col items-start ">
                                    <div className="flex items-center justify-center gap-2">
                                      Colour:{" "}
                                      <span className="font-semibold">
                                        {
                                          item.Inventory
                                            .AttributesOnInventory[0]
                                            .attributeValue.name
                                        }
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                      Size:{" "}
                                      <span className="font-semibold">
                                        {
                                          item.Inventory
                                            .AttributesOnInventory[1]
                                            .attributeValue.value
                                        }
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                      <CartQuantity
                                        quantity={item.Quantity}
                                        setDecrease={() => {
                                          if (item.Quantity <= 1) {
                                            updateItem(item.Inventory.id!, 1);
                                          } else {
                                            decreaseItemQuantity(
                                              item.Inventory.id!
                                            );
                                          }
                                        }}
                                        setIncrease={() => {
                                          if (
                                            item.Quantity >=
                                            item.Inventory.Quantity.quantity
                                          ) {
                                            updateItem(
                                              item.Inventory.id!,
                                              item.Inventory.Quantity.quantity
                                            );
                                          } else {
                                            increaseItemQuantity(
                                              item.Inventory.id!
                                            );
                                          }
                                        }}
                                      ></CartQuantity>
                                    </div>
                                  </div>
                                  <div className="flex mt-1 space-x-1 font-medium selection:select-none">
                                    {item.Inventory.discountedPrice === 0 ? (
                                      <span className=" line-clamp-1 text-xl font-medium">
                                        {formatPrice(item.Inventory.price)}
                                      </span>
                                    ) : (
                                      <div className="flex items-center  gap-2">
                                        <span className=" line-clamp-1 text-xl font-medium">
                                          {formatPrice(
                                            item.Inventory.discountedPrice
                                          )}
                                        </span>
                                        <span className=" line-clamp-1 text-sm line-through text-emboldBlack/60 mt-1">
                                          {formatPrice(item.Inventory.price)}
                                        </span>
                                        <span className=" whitespace-nowrap ">
                                          {discount === 0 ? (
                                            ""
                                          ) : (
                                            <div className=" text-xs  font-semibold text-embold mt-1">
                                              {"("} - {discount}.00 % {")"}
                                            </div>
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                                  <div className="absolute -right-4 lg:-top-10 -top-4">
                                    <Button
                                      aria-label="remove product"
                                      onClick={() =>
                                        removeItem(item.Inventory.id!)
                                      }
                                      variant={"ghost"}
                                    >
                                      <X
                                        className="h-5 w-5 "
                                        aria-hidden={true}
                                      ></X>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>

                <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                  <h2 className="text-lg font-medium text-emboldBlack">
                    Order summary
                  </h2>
                  <div className="mt-6 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">Subtotal</div>
                      <span className="text-s font-medium text-emboldBlack">
                        <div className="">{formatPrice(subtotal)}</div>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">Total Savings</div>
                      <div className="text-s font-medium text-emboldBlack">
                        <div className="text-emboldBlack/50">
                          - {formatPrice(savings)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <div className="text-base font-medium text-emboldBlack">
                        Order total
                      </div>

                      <div className="text-base font-medium text-emboldBlack">
                        {formatPrice(subtotal - savings)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    {!Session ? (
                      <Link
                        className={cn(
                          buttonVariants(),
                          "w-full cursor-pointer"
                        )}
                        href={"/sign-in?origin=cart"}
                      >
                        Please Sign in to continue
                      </Link>
                    ) : (
                      <AddressModal></AddressModal>
                      // <div className=""></div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      ) : (
        <div className="lg:my-20 my-10 flex items-center justify-center w-full">
          <Loading></Loading>
        </div>
      )}
    </>
  );
};

export default page;
