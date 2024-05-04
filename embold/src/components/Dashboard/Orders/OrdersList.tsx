"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Orders } from "@/types/Orders";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import OrdersCard from "./OrdersCard";
import { usePathname } from "next/navigation";
import Loading from "@/components/Helpers/Loading";

interface OrdersListProps {
  orders?: Orders[];
}

const OrdersList: FC<OrdersListProps> = ({ orders: ord }) => {
  const pathname = usePathname();
  const [search, setSearch] = useState<string | null>(null);

  let order;
  const { data: orders, isLoading } = useQuery({
    queryKey: ["dashboardOrders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/orders/fetch");
      return data.orders as Orders[];
    },
  });

  order = ord ? ord : orders;

  const filteredOrders = !search
    ? order
    : order?.filter((name) =>
        name.id!.toLowerCase().includes(search.toLowerCase())
      );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted ? (
        <div>
          {/* top search */}
          {pathname?.includes("dashboard") && (
            <div className="mb-8">
              <Input
                value={search ? search : ""}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Orders"
              ></Input>
            </div>
          )}
          {/* categories list */}
          {orders?.length === 0 ? (
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-3xl">No Orders Found.</h1>
            </div>
          ) : (
            <div
              className={`grid ${
                filteredOrders?.length === 0
                  ? "grid-cols-1"
                  : "2xl:grid-cols-2 grid-cols-1"
              } gap-8 `}
            >
              {filteredOrders?.length === 0 ? (
                <div className="text-center">No Categories</div>
              ) : (
                filteredOrders?.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="hover:shadow-lg hover:shadow-emboldLight/20 lg:p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out"
                    >
                      <OrdersCard order={order}></OrdersCard>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center w-full">
          <Loading></Loading>
        </div>
      )}
    </>
  );
};

export default OrdersList;
