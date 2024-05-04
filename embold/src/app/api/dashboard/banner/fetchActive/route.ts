import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const banner = await db.banner.findMany({});

    return NextResponse.json({ banner });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
