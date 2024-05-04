import WishlistPage from "@/components/Frontend/WishlistPage";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  return (
    <MaxWidthWrapper>
      <div className="lg:my-20 my-16">
        <div className="mb-4 mt-10 flex items-center justify-center gap-4">
          <h1 className="text-center">Your Wishlist</h1>
        </div>
        <WishlistPage></WishlistPage>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
