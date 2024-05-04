import AddressEditor from "@/app/(frontend)/_components/Address/AddressEditor";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = ({}) => {
  return (
    <MaxWidthWrapper className="lg:my-20 my-16 flex justify-center">
      <AddressEditor></AddressEditor>
    </MaxWidthWrapper>
  );
};

export default page;
