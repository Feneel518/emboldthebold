import FrontEndProductList from "@/app/(frontend)/_components/Home/category/FrontEndProductList";
import Empty from "@/components/Helpers/Empty";
import {
  CategoryName,
  ProductFromCategories,
} from "@/components/Utilities/FetchDatas";
import { Wishlist } from "@/types/Wishlist";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sub: string;
  };
}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({ params, searchParams }) => {
  const { slug } = params;

  const { sub } = searchParams;

  const categoryName = sub
    ? await CategoryName(undefined, sub)
    : await CategoryName(undefined, slug);

  const products = sub
    ? await ProductFromCategories(sub)
    : await ProductFromCategories(slug);

  if (products.length === 0)
    return (
      <div className="lg:my-20 my-10">
        <div className="mb-4 mt-10 flex items-center justify-center gap-4">
          <h1 className="text-center">{categoryName?.name}</h1>
        </div>
        <Empty></Empty>
      </div>
    );
  return (
    <div className="lg:my-20 my-10 md:my-16">
      <div className="mb-4 mt-10 flex items-center justify-center gap-4">
        <h1 className="text-center">{categoryName?.name}</h1>
      </div>
      <FrontEndProductList products={products}></FrontEndProductList>
    </div>
  );
};

export default page;
