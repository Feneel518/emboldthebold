import CategoriesEditor from "@/components/Dashboard/Categories/New/CategoriesEditor";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = ({}) => {
  return (
    <div className="">
      <CategoriesEditor></CategoriesEditor>
    </div>
  );
};

export default page;
