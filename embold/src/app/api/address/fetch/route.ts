import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const Session = await getAuthSession();
    if (!Session?.user) return new Response("UNAUTHORIZED", { status: 401 });
    const address = await db.address.findMany({
      where: {
        email: Session.user.email as string,
      },
    });

    return NextResponse.json({ address });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
