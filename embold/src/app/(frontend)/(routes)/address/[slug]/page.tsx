import AddressEditor from "@/app/(frontend)/_components/Address/AddressEditor";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { CheckAuth } from "@/hooks/use-check-auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: { slug: string };
}
export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
const page: FC<pageProps> = async ({ params }) => {
  const { slug } = params;

  const Session = await CheckAuth();

  const address = await db.address.findUnique({
    where: {
      id: slug,
    },
  });
  if (address === undefined) return notFound();

  return (
    <MaxWidthWrapper className="mt-16">
      {/* @ts-ignore */}
      <AddressEditor address={address}></AddressEditor>
    </MaxWidthWrapper>
  );
};

export default page;
