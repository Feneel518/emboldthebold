import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id } = body;

    if (!id) return new Response("No Id found", { status: 401 });
    await db.newsLetter.delete({
      where: {
        id,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    console.log(error);

    return new Response("Could not delete, please try again later", {
      status: 500,
    });
  }
}
