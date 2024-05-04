import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      select: {
        subCategory: {
          select: {
            id: true,
            slug: true,
            image: true,
            name: true,
          },
        },
        name: true,
        slug: true,
        parentId: true,
        id: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
