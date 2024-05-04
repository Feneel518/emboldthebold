import CategoryProductList from "@/components/Dashboard/Categories/CategoryProductList";
import CategoriesEditor from "@/components/Dashboard/Categories/New/CategoriesEditor";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FC } from "react";

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

  const category = await db.category.findFirst({
    where: {
      slug: slug,
    },
    include: {
      parent: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  const products = await db.product.findMany({
    where: {
      categoriesOnProducts: {
        some: {
          category: {
            slug: slug,
          },
        },
      },
    },
    include: {
      Image: true,
      Inventory: {
        include: {
          AttributesOnInventory: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
          Quantity: true,
        },
      },
    },
  });
  if (category === null)
    return (
      <div className="flex items justify-center text-3xl">
        No Category found
      </div>
    );

  return (
    <div className="flex flex-col gap-10">
      {/* @ts-ignore */}
      <CategoriesEditor category={category}></CategoriesEditor>
      {/* @ts-ignore */}
      <CategoryProductList products={products}></CategoryProductList>
    </div>
  );
};

export default page;
