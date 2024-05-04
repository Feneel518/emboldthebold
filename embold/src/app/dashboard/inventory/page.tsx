import InventoryList from "@/components/Dashboard/Inventory/InventoryList";
import PageHeader from "@/components/Utilities/PageHeader";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  // const products = await db.product.findMany({
  //   where: {
  //     Inventory: {
  //       some: {
  //         Quantity: {
  //           quantity: {
  //             equals: 0,
  //           },
  //         },
  //       },
  //     },
  //   },
  //   include: {
  //     Image: true,
  //     Inventory: {
  //       where: {
  //         Quantity: {
  //           quantity: {
  //             equals: 0,
  //           },
  //         },
  //       },
  //       include: {
  //         Quantity: true,
  //         AttributesOnInventory: {
  //           include: {
  //             attributeValue: {
  //               include: {
  //                 attribute: {
  //                   include: {
  //                     AttributeValue: true,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  // products.map((item) =>
  //   item.Inventory.map((attr) =>
  //     attr.AttributesOnInventory.sort((a, b) =>
  //       a.attributeValue.attribute.name > b.attributeValue.attribute.name
  //         ? 1
  //         : -1
  //     )
  //   )
  // );
  return (
    <div className="bg-emboldBlack w-full h-full lg:p-8 p-4 rounded-lg text-emboldLight ">
      <PageHeader></PageHeader>
      <InventoryList></InventoryList>
    </div>
  );
};

export default page;
