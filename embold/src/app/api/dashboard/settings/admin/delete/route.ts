import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id } = body;

    const userExist = await db.user.findUnique({
      where: {
        email: id,
      },
    });

    const isAdmins = await db.user.findUnique({
      where: {
        email: id,
      },
      select: {
        isAdmin: true,
      },
    });

    if (!userExist || !isAdmins?.isAdmin) {
      return new Response("user is not admin or user doesn't exist", {
        status: 401,
      });
    }
    await db.user.update({
      where: {
        email: id,
      },
      data: {
        isAdmin: false,
      },
    });
    return new Response("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not delete, please try again later", {
      status: 500,
    });
  }
}
