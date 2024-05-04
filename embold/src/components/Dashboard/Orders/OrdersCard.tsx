"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { Orders } from "@/types/Orders";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface OrdersCardProps {
  order: Orders;
}

const OrdersCard: FC<OrdersCardProps> = ({ order }) => {
  const pathname = usePathname();

  return (
    <Card
      className={`p-4 h-full ${
        !pathname?.includes("dashboard") &&
        "bg-emboldLight50/50 text-emboldBlack"
      }`}
    >
      <CardContent className="p-2">
        <Link
          key={order.id}
          href={
            pathname?.includes("dashboard")
              ? `/dashboard/orders/${order.id}`
              : `/orders/${order.id}`
          }
          className=" flex flex-col gap-4"
        >
          <div className="flex flex-col gap-4">
            <div className="flex lg:items-center lg:justify-between border-b lg:flex-row flex-col">
              <div className="mb-2 flex lg:items-center gap-2 lg:gap-8 lg:flex-row flex-col">
                <div className="flex flex-col gap-1 text-sm">
                  <Label
                    className={`${
                      pathname?.includes("dashboard")
                        ? "text-white/50"
                        : "text-emboldBlack"
                    }`}
                  >
                    Order Placed
                  </Label>
                  <div className="">
                    {new Date(order.createdAt!).toDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <Label
                    className={`${
                      pathname?.includes("dashboard")
                        ? "text-white/50"
                        : "text-emboldBlack"
                    }`}
                  >
                    Total
                  </Label>
                  <div className="">{formatPrice(order.amount)}</div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <Label
                    className={`${
                      pathname?.includes("dashboard")
                        ? "text-white/50"
                        : "text-emboldBlack"
                    }`}
                  >
                    Ship to
                  </Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center ">
                        {order.user ? order.user.name : order.userName}
                        <ChevronDown className="w-4 h-4 "></ChevronDown>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">
                            {order.user ? order.user.name : order.userName}
                          </h4>
                          <div className="text-sm">
                            {order.Address ? (
                              <div className="">
                                {order.Address.addressLine1} <br />{" "}
                                {order.Address.addressLine2} <br />
                                {order.Address.city} {order.Address.state}{" "}
                                {order.Address.country} <br />
                                {order.Address.pinCode}
                              </div>
                            ) : (
                              <div className="">
                                Offline order, Hand delivered.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
              <div className="flex flex-col  text-sm">
                <div className="flex items-center gap-2  text-sm ">
                  <Label
                    className={`${
                      pathname?.includes("dashboard")
                        ? "text-white/50"
                        : "text-emboldBlack"
                    }`}
                  >
                    Order
                  </Label>
                  <div className=""># {order.id}</div>
                </div>
                <div className="flex items-center gap-2  text-sm">
                  <Label
                    className={`${
                      pathname?.includes("dashboard")
                        ? "text-white/50"
                        : "text-emboldBlack"
                    }`}
                  >
                    View order details
                  </Label>
                </div>
              </div>
            </div>
            <div className="">
              <div className="">{order.status}</div>
              <div className="flex flex-col gap-8 mt-8">
                {order.InventoryOnOrders.map((items) => {
                  return (
                    <div className="flex gap-10">
                      <div className="w-32">
                        <Image
                          className="w-full h-full"
                          src={items.inventory.Product?.Image[0]?.url}
                          alt={items.inventory.Product?.name}
                          width={400}
                          height={400}
                        ></Image>
                      </div>
                      <div className="w-64">
                        <div className="lg:text-xl">
                          <Link
                            href={`/product/${items.inventory.Product?.slug}`}
                            className="hover:underline hover:underline-offset-2"
                          >
                            {items.inventory.Product?.name}
                          </Link>
                        </div>
                        <div className="flex  gap-4 mt-4">
                          {items.inventory.AttributesOnInventory.map((attr) => (
                            <div className="">
                              {attr.attributeValue.name
                                ? attr.attributeValue.name
                                : attr.attributeValue.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <Label>Payment Status:</Label>
                    {order.paid ? (
                      <Badge variant={"success"}>Paid</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Pending</Badge>
                    )}
                  </div>
                  {order.paid && (
                    <div className="flex items-center gap-2">
                      <Label>Order Status: </Label>
                      {order.status === "ORDERED" ? (
                        <Badge variant={"secondary"}>Placed</Badge>
                      ) : order.status === "DELIVERED" ? (
                        <Badge variant={"success"}>Delivered</Badge>
                      ) : (
                        <Badge variant={"default"}>In transit</Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default OrdersCard;
