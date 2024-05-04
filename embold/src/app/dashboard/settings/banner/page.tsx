import BannerForm from "@/components/Dashboard/Settings/Banner/BannerForm";
import BannerList from "@/components/Dashboard/Settings/Banner/BannerList";

import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="mb-1 text-xl">Banner Settings</h1>
        {/* <Separator></Separator> */}
      </div>

      <BannerForm></BannerForm>

      <BannerList></BannerList>
    </div>
  );
};

export default page;
