import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const Session = await getAuthSession();
    if (!Session?.user) return new Response("UNAUTHORIZED", { status: 401 });

    const body = await req.json();

    const { id } = body;

    await db.address.deleteMany({
      where: {
        id: id,
        email: Session.user.email!,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    console.log(error);

    return new Response("Could not add a address, please try again later", {
      status: 500,
    });
  }
}
