import CustomerList from "@/components/Dashboard/Customers/CustomerList";
import PageHeader from "@/components/Utilities/PageHeader";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}
export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  const customers = await db.user.findMany({
    select: {
      phoneNumber: true,
      email: true,
      image: true,
      name: true,
      Address: {
        select: {
          phoneNumber: true,
        },
      },
      Orders: {
        select: {
          id: true,
          InventoryOnOrders: {
            select: {
              inventory: {
                select: {
                  Product: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      Wishlist: {
        select: {
          id: true,
          WishlistOnProducts: {
            include: {
              Product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      id: true,
    },
  });

  return (
    <div className="bg-emboldBlack w-full h-full lg:p-8 p-4 rounded-lg text-emboldLight ">
      <PageHeader></PageHeader>
      {/* @ts-ignore */}
      <CustomerList customers={customers}></CustomerList>
    </div>
  );
};

export default page;
