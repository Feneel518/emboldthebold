import OrdersCard from "@/components/Dashboard/Orders/OrdersCard";
import ProductsCard from "@/components/Dashboard/Products/ProductsCard";
import ProductCard from "@/components/Frontend/ProductCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const customerDetails = await db.user.findUnique({
    where: {
      id: params.slug,
    },
    include: {
      Address: {
        where: {
          isDefault: false,
        },
      },
      Orders: {
        include: {
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
        },
      },
      Wishlist: {
        include: {
          WishlistOnProducts: {
            include: {
              Product: {
                include: {
                  Image: true,
                  Inventory: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="bg-emboldBlack w-full h-full lg:p-8 p-4 rounded-lg text-emboldLight ">
      <div className="">
        <div className="w-full flex flex-col gap-4 items-center  lg:flex-row lg:justify-between">
          <div className="">
            <h1 className="text-3xl max-lg:text-center">Customer Details</h1>
            <p className="text-sm text-emboldLight/70 max-lg:text-center">
              Your customer details and performance.
            </p>
          </div>
        </div>
        <Separator className="my-8 "></Separator>
      </div>
      <div className="mt-4 text-emboldLight ">
        <div className="flex items-start justify-between">
          <div className="">
            <h1 className="text-3xl">{customerDetails?.name}</h1>
            <p>{customerDetails?.email}</p>
            <p>
              {customerDetails?.phoneNumber ? customerDetails.phoneNumber : ""}
            </p>
          </div>
          <div className="">
            <div className="text-right">
              <div className="">
                {customerDetails?.Address[0]?.addressLine1}
              </div>
              <div className="">
                {customerDetails?.Address[0]?.addressLine2}
              </div>
              <div className="">{customerDetails?.Address[0]?.city} </div>
              <div className="">{customerDetails?.Address[0]?.state} </div>
              <div className="">{customerDetails?.Address[0]?.country}</div>
              <div className="">{customerDetails?.Address[0]?.pinCode}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="">
              <h2 className="text-2xl mb-4 text-center">Orders</h2>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <div
                className={`grid ${
                  customerDetails?.Orders?.length === 0
                    ? "grid-cols-1"
                    : "lg:grid-cols-2 grid-cols-1"
                } gap-8 `}
              >
                {customerDetails?.Orders?.length === 0 ? (
                  <div className="text-center">No Categories</div>
                ) : (
                  customerDetails?.Orders?.map((order) => {
                    return (
                      <div
                        key={order.id}
                        className="hover:shadow-lg hover:shadow-emboldLight/20 lg:p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out"
                      >
                        {/* @ts-ignore */}
                        <OrdersCard order={order}></OrdersCard>
                      </div>
                    );
                  })
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="">
              <h2 className="text-2xl mb-4 text-center">Wishlist</h2>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
                {customerDetails?.Wishlist?.WishlistOnProducts.map((wish) => {
                  return (
                    <ProductsCard
                      key={wish.id}
                      // @ts-ignore
                      product={wish.Product}
                      isCard={true}
                    ></ProductsCard>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default page;
