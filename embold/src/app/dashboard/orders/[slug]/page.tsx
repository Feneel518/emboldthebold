import ShippingStatus from "@/components/Dashboard/Orders/ShippingStatus";
import { Badge } from "@/components/ui/badge";
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
    slug: string;
  };
}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({ params }) => {
  const { slug } = params;

  const order = await db.orders.findFirst({
    where: {
      id: slug,
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
    <Card className="flex-1 bg-emboldBlack p-4 mb-40">
      <CardHeader>
        <CardTitle>Order details</CardTitle>
        <CardDescription>Order Information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex lg:items-center lg:justify-between border-b lg:flex-row flex-col">
            <div className="mb-2 flex lg:items-center gap-2 lg:gap-8 lg:flex-row flex-col">
              <div className="flex flex-col gap-1 text-sm">
                <Label className="text-white/50">Order Placed</Label>
                <div className="">
                  {new Date(order.createdAt!).toDateString()}
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <Label className="text-white/50">Total</Label>
                <div className="">{formatPrice(order.amount!)}</div>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <Label className="text-white/50">Payment</Label>
                {order.paid ? (
                  <Badge variant={"success"}>Paid</Badge>
                ) : (
                  <Badge variant={"destructive"}>Pending</Badge>
                )}
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <Label className="text-white/50">Ship to</Label>

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
                <Label className="text-white/50">Order</Label>
                <div className=""># {order.id}</div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="">{order.status}</div>
            <div className="">
              {order.isOnline ? "Online Order" : "Offline Order"}
            </div>
            <div className="flex flex-col gap-8 mt-8">
              {order.InventoryOnOrders.map((items) => {
                return (
                  <div className="" key={items.id}>
                    <div className="flex gap-10">
                      <div className="w-64 h-80  overflow-hidden rounded-xl transition-all duration-300">
                        <Image
                          draggable={false}
                          className=" object-contain object-top rounded-xl"
                          src={items.inventory.Product!.Image[0].url}
                          alt={items.inventory.Product!.name}
                          width={247}
                          height={2470}
                        ></Image>
                      </div>

                      <div className="">
                        <div className="lg:text-xl">
                          <Link
                            href={`/product/${items.inventory.Product!.slug}`}
                            className="hover:underline hover:underline-offset-2"
                          >
                            {items.inventory.Product!.name}
                          </Link>
                        </div>
                        <div className="flex  gap-4 mt-4">
                          {items.inventory.AttributesOnInventory.map((attr) => (
                            <div className="" key={attr.id}>
                              {attr.attributeValue.name
                                ? attr.attributeValue.name
                                : attr.attributeValue.value}
                            </div>
                          ))}
                        </div>
                        <div className=" mt-4">Quantity: {items.quantity}</div>
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
            {order.isOnline && (
              <ShippingStatus
                orderId={order.id}
                orderStatus={order.status}
                courierName={order.courierName}
                courierDocketId={order.courierDocketId}
              ></ShippingStatus>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default page;
