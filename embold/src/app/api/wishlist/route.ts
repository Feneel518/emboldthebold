import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const Session = await getAuthSession();
    if (!Session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id }: { id: string } = body;

    const isThereAWishlistForThisUser = await db.wishlist.findUnique({
      where: {
        userId: Session.user.id,
      },
    });

    if (isThereAWishlistForThisUser) {
      const isThereAlreadyAProductInThisWishlist =
        await db.wishlistOnProducts.findFirst({
          where: {
            AND: [
              {
                wishlistId: isThereAWishlistForThisUser.id,
              },
              {
                productId: id,
              },
            ],
          },
        });

      if (isThereAlreadyAProductInThisWishlist) {
        await db.wishlistOnProducts.deleteMany({
          where: {
            AND: [
              {
                productId: id,
              },
              {
                wishlistId: isThereAWishlistForThisUser.id,
              },
            ],
          },
        });
        return new Response("Removed from", { status: 201 });
      } else {
        await db.wishlistOnProducts.create({
          data: {
            productId: id,
            wishlistId: isThereAWishlistForThisUser.id,
          },
        });
        return new Response("Added to", { status: 200 });
      }
    } else {
      const wishlist = await db.wishlist.create({
        data: {
          userId: Session.user.id,
        },
      });
      await db.wishlistOnProducts.create({
        data: {
          productId: id,
          wishlistId: wishlist.id,
        },
      });
      return new Response("Added to", { status: 200 });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
