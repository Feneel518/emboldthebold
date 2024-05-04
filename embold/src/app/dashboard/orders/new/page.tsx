import OrdersEditor from "@/components/Dashboard/Orders/OrdersEditor";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <OrdersEditor></OrdersEditor>
    </div>
  );
};

export default page;
