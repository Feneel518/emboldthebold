import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validators/CategoryValidtor";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { isActive, name, parentId, showOnHome, image } =
      CategoryValidator.parse(body);

    const cateOrder = await db.category.findMany({
      select: {
        order: true,
      },
    });

    const max = Math.max(...(cateOrder.flatMap((a) => a.order) as number[]));

    await db.category.create({
      data: {
        name: name,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        image: image,
        isActive: isActive,
        parentId: parentId === "" ? null : parentId,
        showOnHome: showOnHome,
        order: max + 1,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.log(error);

    return new Response("Could not create a category, please try again later", {
      status: 500,
    });
  }
}
