"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Categories from "@/app/(frontend)/_components/Home/Categories";

interface PageHeaderProps {}

const PageHeader: FC<PageHeaderProps> = ({}) => {
  const pathname = usePathname();
  let path: string = "";
  let paths: string = "";

  if (pathname?.includes("categories")) {
    path = "Category";
    paths = "Categories";
  }

  if (pathname?.includes("products")) {
    path = "Product";
    paths = "Products";
  }
  if (pathname?.includes("orders")) {
    path = "Order";
    paths = "Orders";
  }

  if (pathname?.includes("inventory")) {
    path = "Inventory";
    paths = "Inventory";
  }

  if (pathname?.includes("customers")) {
    path = "Customer";
    paths = "Customers";
  }
  return (
    <div className="">
      <div className="w-full flex flex-col gap-4 items-center  lg:flex-row lg:justify-between">
        <div className="">
          <h1 className="text-3xl max-lg:text-center">
            {paths} List{" "}
            <span className="text-xs text-emboldLight/50">
              {paths === "Inventory" &&
                "( Only items with 0 quantites are displayed. )"}
            </span>
          </h1>
          <p className="text-sm text-emboldLight/70 max-lg:text-center">
            Your {paths} details and performance.
          </p>
        </div>
        {!pathname?.includes("inventory") && (
          <Link
            href={`/dashboard/${paths.toLowerCase()}/new`}
            className="max-lg:w-full"
          >
            <Button className="rounded-md max-lg:w-full" variant={"secondary"}>
              <Plus className="w-4 h-4"></Plus> Add {path}
            </Button>
          </Link>
        )}
      </div>
      <Separator className="my-8 "></Separator>
    </div>
  );
};

export default PageHeader;
