import OrdersList from "@/components/Dashboard/Orders/OrdersList";
import PageHeader from "@/components/Utilities/PageHeader";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  return (
    <div className="bg-emboldBlack w-full h-full lg:p-8 p-4 rounded-lg text-emboldLight ">
      <PageHeader></PageHeader>

      <OrdersList></OrdersList>
    </div>
  );
};

export default page;
