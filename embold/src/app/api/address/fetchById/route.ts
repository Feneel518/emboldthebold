import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const Session = await getAuthSession();
    if (!Session?.user) return new Response("UNAUTHORIZED", { status: 401 });

    const addressId = req.nextUrl.searchParams.get("addressId");

    const address = await db.address.findUnique({
      where: {
        id: addressId as string,
      },
    });

    return NextResponse.json({ address });
    // return new Response("OK");
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
