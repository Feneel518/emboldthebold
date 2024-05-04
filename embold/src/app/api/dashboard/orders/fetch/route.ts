import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const Session = await getAuthSession();

    if (!Session?.user) return new Response("UNAUTHORIZED", { status: 401 });

    const orders = await db.orders.findMany({
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

    return NextResponse.json({ orders });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
