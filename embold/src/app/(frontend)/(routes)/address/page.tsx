import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { CheckAuth } from "@/hooks/use-check-auth";
import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}
export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  const Session = await CheckAuth();

  const address = await db.address.findMany({
    where: {
      email: Session.user.email!,
    },
  });

  return (
    <MaxWidthWrapper className="lg:mt-20 my-16">
      <div className="">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Your Addresses {`(${address.length})`}
          </h1>
          <div className="">
            <Link href={"/address/new"} className={buttonVariants()}>
              Add new Address
            </Link>
          </div>
        </div>
        <div className="w-full  mt-10 grid lg:grid-cols-3 gap-4">
          {address.map((add) => {
            return (
              <Link
                href={`/address/${add.id}`}
                className="p-4 flex flex-col items-start gap-2 w-full border rounded-md shadow-md cursor-pointer"
              >
                <h1 className="font-bold">
                  {add.firstName} {add.lastName}
                </h1>
                {add.addressLine1}, {"    "}
                {add.state}
                {add.isDefault && (
                  <Badge variant={"success"} className="font-bold mt-2">{`${
                    add.isDefault ? "Default" : ""
                  }`}</Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
