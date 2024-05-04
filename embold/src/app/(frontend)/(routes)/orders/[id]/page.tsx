import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { HoverCard } from "@radix-ui/react-hover-card";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";

interface pageProps {
  params: {
    id: string;
  };
}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({ params }) => {
  const { id } = params;

  const order = await db.orders.findFirst({
    where: {
      id: id,
    },
    include: {
      user: true,
      Address: true,
      InventoryOnOrders: {
        include: {
          inventory: {
            include: {
              AttributesOnInventory: {
                include: {
                  attributeValue: true,
                },
              },
              Quantity: true,
              Product: {
                select: {
                  name: true,
                  slug: true,
                  Image: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) return notFound();
  return (
    <MaxWidthWrapper>
      <Card className="flex-1 bg-emboldLight50/20 text-emboldBlack p-4 lg:mt-20 mt-16 ">
        <CardHeader>
          <CardTitle>Order details</CardTitle>
          <CardDescription className="text-emboldBlack">
            Order Information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex lg:items-center lg:justify-between border-b lg:flex-row flex-col">
              <div className="mb-2 flex lg:items-center gap-8 flex-row flex-wrap">
                <div className="flex flex-col gap-1 text-sm">
                  <Label className="text-emboldBlack/70">Order Placed</Label>
                  <div className="">
                    {new Date(order.createdAt!).toDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <Label className="text-emboldBlack/70">Total</Label>
                  <div className="">{formatPrice(order.amount!)}</div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <Label className="text-emboldBlack/70">Payment</Label>
                  <div className="">{order.paid ? "Paid" : "Pending"}</div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <Label className="text-emboldBlack/70">Ship to</Label>

                  <div className="flex items-center ">
                    {order.user ? order.user.name : order.userName}
                  </div>

                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <div className="text-sm">
                        {order.Address ? (
                          <div className="">
                            <div className="">{order.Address.addressLine1}</div>
                            <div className="">{order.Address.addressLine2}</div>
                            <div className="">
                              {order.Address.city} {order.Address.state}{" "}
                            </div>
                            <div className="">{order.Address.country}</div>
                            <div className="">{order.Address.pinCode}</div>
                          </div>
                        ) : (
                          <div className="">Offline order, Hand delivered.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col  text-sm">
                <div className="flex items-center gap-2  text-sm ">
                  <Label className="text-emboldBlack/70">Order</Label>
                  <div className=""># {order.id}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between lg:flex-row flex-col">
              <div className="">
                <div className="">{order.status}</div>
                <div className="flex flex-col gap-8 mt-8">
                  {order.InventoryOnOrders.map((items) => {
                    return (
                      <div className="" key={items.id}>
                        <div className="flex gap-10">
                          <div className="w-32">
                            <Image
                              className="w-full h-full"
                              src={items.inventory.Product!.Image[0].url}
                              alt={items.inventory.Product!.name}
                              width={400}
                              height={400}
                            ></Image>
                          </div>
                          <div className="">
                            <div className="lg:text-xl">
                              <Link
                                href={`/product/${
                                  items.inventory.Product!.slug
                                }`}
                                className="hover:underline hover:underline-offset-2"
                              >
                                {items.inventory.Product!.name}
                              </Link>
                            </div>
                            <div className="flex  gap-4 mt-4">
                              {items.inventory.AttributesOnInventory.map(
                                (attr) => (
                                  <div className="" key={attr.id}>
                                    {attr.attributeValue.name
                                      ? attr.attributeValue.name
                                      : attr.attributeValue.value}
                                  </div>
                                )
                              )}
                            </div>
                            <div className=" mt-4">
                              Quantity: {items.quantity}
                            </div>
                            <div className=" mt-4">
                              price: {formatPrice(items.price)}
                            </div>
                          </div>
                        </div>
                        <div className="h-[1px] w-full bg-emboldLight/30 my-8"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="">
                {(order.status === "IN_TRANSIT" ||
                  order.status === "DELIVERED") && (
                  <div className="">
                    Your Order has been dispatched by {order.courierName} <br />{" "}
                    and your tracking id is {order.courierDocketId}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

export default page;
