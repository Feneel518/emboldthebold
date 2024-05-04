import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const product = await db.product.findMany({
      where: {
        AND: [
          {
            Inventory: {
              some: {
                Quantity: {
                  quantity: {
                    equals: 0,
                  },
                },
              },
            },
          },
          {
            deleted: false,
          },
        ],
      },
      select: {
        name: true,
        slug: true,
        id: true,
        Image: {
          select: {
            altText: true,
            url: true,
          },
        },
        Inventory: {
          select: {
            AttributesOnInventory: {
              select: {
                attributeValue: {
                  select: {
                    name: true,
                    value: true,
                    attribute: {
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
      },
      // include: {
      //   Image: true,
      //   Inventory: {
      //     where: {
      //       Quantity: {
      //         quantity: {
      //           equals: 0,
      //         },
      //       },
      //     },
      //     include: {
      //       Quantity: true,
      //       AttributesOnInventory: {
      //         include: {
      //           attributeValue: {
      //             include: {
      //               attribute: {
      //                 include: {
      //                   AttributeValue: true,
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
