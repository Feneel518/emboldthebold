import CategoriesList from "@/components/Dashboard/Categories/CategoriesList";
import ProductsList from "@/components/Dashboard/Products/ProductsList";
import PageHeader from "@/components/Utilities/PageHeader";
import { db } from "@/lib/db";
import { getAllProducts, getProducts } from "@/lib/queries";
import { Product } from "@/types/Product";
import { FC } from "react";

interface pageProps {}
export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  const products = await getProducts();
  const prod = await db.product.findMany({
    where: {
      deleted: false,
    },
    include: {
      categoriesOnProducts: {
        include: {
          category: true,
        },
      },
      Image: true,
      Inventory: {
        include: {
          Quantity: true,
          AttributesOnInventory: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-emboldBlack w-full h-full lg:p-8 p-4 rounded-lg text-emboldLight">
      <PageHeader></PageHeader>
      {/* @ts-ignore */}
      <ProductsList products={prod} initialProducts={products}></ProductsList>
    </div>
  );
};

export default page;
