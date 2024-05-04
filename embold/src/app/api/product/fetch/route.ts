import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    // const productSlug = req.nextUrl.searchParams.get("slug");

    // if (!productSlug) return new Response("Slug not found", { status: 401 });

    // const product = await db.product.findFirst({
    //   where: {
    //     slug: productSlug,
    //     isActive: true,
    //   },
    //   include: {
    //     categoriesOnProducts: {
    //       include: {
    //         category: {
    //           select: {
    //             slug: true,
    //           },
    //         },
    //       },
    //     },
    //     Image: true,
    //     Inventory: {
    //       include: {
    //         AttributesOnInventory: {
    //           include: {
    //             attributeValue: true,
    //           },
    //         },
    //         Quantity: true,
    //         Product: {
    //           select: {
    //             name: true,
    //             Image: true,
    //             slug: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    return new Response("OK");
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    console.log(error);

    return new Response(error.message, { status: 500 });
  }
}
