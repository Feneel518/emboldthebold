"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Customers } from "@/types/Customers";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import ExportCSV from "../Settings/NewsLetter/ExportCSV";
import { CSVLink } from "react-csv";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface CustomerListProps {
  customers: Customers[];
}

const CustomerList: FC<CustomerListProps> = ({ customers }) => {
  const [search, setSearch] = useState<string>("");

  const filtered = customers.filter((name) =>
    name.name.toLowerCase().includes(search.toLowerCase())
  );

  const headers = [
    { label: "Id", key: "id" },
    { label: "Email", key: "email" },
    { label: "Image", key: "image" },
    { label: "Name", key: "name" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Orders", key: "Orders" },
    { label: "OrderProductName", key: "orderProductName" },
    { label: "Wishlist", key: "Wishlist" },
    { label: "wishlistProductName", key: "wishlistProductName" },
  ];

  let data: any = [];

  customers.forEach((item) => {
    data.push({
      id: item.id,
      name: item.name,
      email: item.email,
      image: item.image,
      phoneNumber: item.phoneNumber
        ? item.phoneNumber
        : item.Address
        ? item.Address[0]?.phoneNumber
        : "",
      Orders: item.Orders[0]?.id,
      orderProductName:
        item.Orders[0]?.InventoryOnOrders[0]?.inventory?.Product?.name,
      Wishlist: item.Wishlist?.id,
      wishlistProductName: item.Wishlist?.WishlistOnProducts[0]?.Product.name,
    });

    for (
      let i = 1;
      i <
      (item.Orders.length > item.Wishlist?.WishlistOnProducts?.length
        ? item.Orders.length
        : item.Wishlist?.WishlistOnProducts?.length);
      i++
    ) {
      const orderId = item.Orders[i]?.id;
      const wishlistName = item.Wishlist?.WishlistOnProducts[i]?.Product?.name;

      const orderName =
        item.Orders[i].InventoryOnOrders[0]?.inventory?.Product?.name;
      data.push({
        id: "",
        name: "",
        email: "",
        image: "",
        phoneNumber: "",

        Orders: orderId,
        orderProductName: orderName,
        Wishlist: "",
        wishlistProductName: wishlistName,
      });
      for (let j = 1; j < item.Orders[i].InventoryOnOrders.length; j++) {
        const prodName =
          item.Orders[i].InventoryOnOrders[j]?.inventory?.Product?.name;
        data.push({
          id: "",
          name: "",
          email: "",
          image: "",
          Orders: "",
          phoneNumber: "",
          orderProductName: prodName,
          Wishlist: "",
          wishlistProductName: "",
        });
      }
    }
  });

  return (
    <div className="mt-4 text-emboldLight ">
      <div className="item-center mx-auto mt-4 flex w-[90%] justify-center gap-2">
        <Input
          className=""
          type="text"
          placeholder="Search Customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></Input>
        <Search className="mt-1 cursor-pointer" />
      </div>
      <div className="mt-10 flex flex-col gap-2 ">
        <div className="flex items-center justify-center">
          <CSVLink
            headers={headers}
            data={data}
            target="_blank"
            filename="Subscribe"
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-emboldLight w-fit flex"
            )}
          >
            Export list
          </CSVLink>
        </div>
        <Separator className="mt-1 bg-emboldLight/50"></Separator>

        <div className="grid grid-cols-2 gap-8">
          {filtered.map((cust) => {
            return (
              <Link
                key={cust.id}
                href={`/dashboard/customers/${cust.id}`}
                className="hover:shadow-lg hover:shadow-emboldLight/20 lg:p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <Card className="">
                  <CardContent className="p-2">
                    <div className="flex gap-2 lg:gap-8">
                      <div className="max-lg:w-1/2 ">
                        {cust.image ? (
                          <Image
                            className="mx-auto w-24 rounded-xl"
                            alt={cust.name ? "abc" : "efg"}
                            src={cust.image ? cust.image : ""}
                            width={400}
                            height={400}
                          ></Image>
                        ) : (
                          <div className="text-center text-5xl border p-4 rounded-xl ">
                            {cust.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between gap-8 w-1/2">
                        <div className="flex flex-col gap-2">
                          <h1 className="lg:text-2xl">{cust.name}</h1>
                        </div>
                        <div className="">Orders: {cust.Orders.length}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
