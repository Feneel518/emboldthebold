import NewProductEditor from "@/components/Dashboard/Products/new/NewProductEditor";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
const page: FC<pageProps> = ({}) => {
  return (
    <div className="">
      <NewProductEditor product={null}></NewProductEditor>
    </div>
  );
};

export default page;
