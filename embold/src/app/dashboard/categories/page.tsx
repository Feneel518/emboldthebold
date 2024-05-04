import CategoriesList from "@/components/Dashboard/Categories/CategoriesList";
import NotAdmin from "@/components/Helpers/NotAdmin";
import PageHeader from "@/components/Utilities/PageHeader";
import { getCategories } from "@/components/Utilities/fetch";
import { getAuthSession } from "@/lib/auth/auth";
import { Category } from "@/types/Category";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const categories = await getCategories();
  return (
    <div className="bg-emboldBlack w-full h-full p-4 lg:p-8 rounded-lg text-emboldLight ">
      <PageHeader></PageHeader>
      <CategoriesList categories={categories}></CategoriesList>
    </div>
  );
};

export default page;
