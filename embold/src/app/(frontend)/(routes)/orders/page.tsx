import OrdersList from "@/components/Dashboard/Orders/OrdersList";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  const Session = await getAuthSession();

  if (!Session?.user.email) redirect("/");

  const orders = await db.orders.findMany({
    where: {
      AND: [
        {
          email: Session.user.email,
        },
        {
          paid: true,
        },
      ],
    },
    include: {
      user: true,
      InventoryOnOrders: {
        include: {
          inventory: {
            include: {
              Product: {
                select: {
                  name: true,
                  Image: true,
                  slug: true,
                  description: true,
                },
              },
              AttributesOnInventory: {
                include: {
                  attributeValue: true,
                },
              },
            },
          },
        },
      },
      Address: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // const orders = await db.orders.findMany({
  //   where: {
  //     user: {
  //       email: Session.user.email!,
  //     },
  //     paid: true,
  //   },
  //   include: {
  //     user: true,
  //     InventoryOnOrders: {
  //       include: {
  //         inventory: {
  //           include: {
  //             Product: {
  //               select: {
  //                 name: true,
  //                 Image: true,
  //                 slug: true,
  //                 description: true,
  //               },
  //             },
  //             AttributesOnInventory: {
  //               include: {
  //                 attributeValue: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     Address: true,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });
  return (
    <div className="lg:my-16">
      <MaxWidthWrapper>
        <div className="">
          <h1 className="text-4xl text-center">Your Orders</h1>
        </div>
        <div className="h-[1px] w-full bg-emboldBlack/20 my-4"></div>

        <div className="bg-emboldLight/10 p-8 rounded-xl">
          {/* @ts-ignore */}
          <OrdersList orders={orders}></OrdersList>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
