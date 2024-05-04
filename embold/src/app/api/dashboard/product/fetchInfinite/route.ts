import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { limit, page } = z
      .object({
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });
    const product = await db.product.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
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
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
