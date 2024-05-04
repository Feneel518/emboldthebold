import NewProductEditor from "@/components/Dashboard/Products/new/NewProductEditor";
import { db } from "@/lib/db";
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

  const product = await db.product.findFirst({
    where: {
      slug: slug,
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

  if (product === null)
    return (
      <div className="flex items justify-center text-3xl">No Product found</div>
    );

  return (
    <div>
      {/* @ts-ignore */}
      <NewProductEditor product={product}></NewProductEditor>
    </div>
  );
};

export default page;
