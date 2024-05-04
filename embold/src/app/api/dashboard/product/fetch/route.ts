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
      // where: {
      //   Inventory: {
      //     some: {
      //       Quantity: {
      //         quantity: {
      //           gt: 0,
      //         },
      //       },
      //     },
      //   },
      // },
      where: {
        deleted: false,
      },
      include: {
        categoriesOnProducts: {
          include: {
            category: true,
          },
        },
        Image: true,
        Inventory: {
          include: {
            Quantity: true,
            AttributesOnInventory: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
