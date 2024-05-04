import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.toLowerCase();

    if (!q) {
      return new Response("Invalid Query", { status: 400 });
    }

    const productResults = await db.product.findMany({
      where: {
        slug: {
          contains: q,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
    const cateResults = await db.category.findMany({
      where: {
        slug: {
          contains: q,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return new Response(JSON.stringify({ productResults, cateResults, url }));
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
}
