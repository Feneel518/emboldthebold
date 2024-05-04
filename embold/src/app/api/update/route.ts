import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const products = await db.product.findMany({});

    products.map(async (prod) => {
      await db.product.update({
        where: {
          id: prod.id,
        },
        data: {
          slug: encodeURIComponent(prod.name.toLowerCase()),
        },
      });
    });

    return NextResponse.json({ products });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
