import ProductPage from "@/app/(frontend)/_components/product/ProductPage";
import { ProductFromCategories } from "@/components/Utilities/FetchDatas";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
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
  const session = await getAuthSession();

  const product = await db.product.findFirst({
    where: {
      slug: slug,
      isActive: true,
    },
    include: {
      WishlistOnProducts: {
        where: {
          Wishlist: {
            userId: session?.user.id,
          },
        },
      },
      categoriesOnProducts: {
        include: {
          category: {
            select: {
              slug: true,
            },
          },
        },
      },
      Image: true,
      Inventory: {
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
              Image: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!product) redirect("/");

  const categoryName = product.categoriesOnProducts[0].category.slug;

  const products = await ProductFromCategories(categoryName, 9);

  const productss = products.filter((item) => item.id !== product.id);

  return (
    <div className="mt-16 mb-20 overflow-x-hidden">
      <MaxWidthWrapper>
        {/* {product?.name} */}
        <ProductPage
          slug={slug}
          //@ts-ignore
          product={product}
          //@ts-ignore
          relatedProducts={productss}
        ></ProductPage>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
