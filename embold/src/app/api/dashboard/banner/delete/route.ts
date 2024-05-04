import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    const bannerExist = await db.banner.findFirst({
      where: {
        id: id,
      },
    });
    if (!bannerExist) {
      return new Response("No banner found with this id.", {
        status: 400,
      });
    }
    await db.banner.delete({
      where: {
        id: id,
      },
    });

    return new Response("ok");
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
