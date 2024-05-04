import Testimonials from "@/components/Dashboard/Settings/testimonials/Testimonials";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  return (
    <div>
      <Testimonials></Testimonials>
    </div>
  );
};

export default page;
