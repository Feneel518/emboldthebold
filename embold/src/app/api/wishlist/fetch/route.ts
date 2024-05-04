// import { getAuthSession } from "@/lib/auth/auth";
// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";
// import { z } from "zod";

import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// export async function GET(req: Request) {
//   try {
//     const Session = await getAuthSession();

//     if (!Session?.user) return new Response("Unauthorized", { status: 401 });

//     const wishlist = await db.wishlist.findUnique({
//       where: {
//         userId: Session.user.id,
//       },
//     });

//     if (wishlist) {
//       const wishlistData = await db.wishlistOnProducts.findMany({
//         where: {
//           wishlistId: wishlist?.id,
//         },
//         include: {
//           Product: {
//             include: {
//               Image: true,
//               Inventory: {
//                 include: {
//                   AttributesOnInventory: {
//                     include: {
//                       attributeValue: true,
//                     },
//                   },
//                   Quantity: true,
//                 },
//               },
//               WishlistOnProducts: true,
//             },
//           },
//         },
//       });

//       return NextResponse.json({ wishlistData });
//     }
//     return new Response("OK");
//   } catch (error: any) {
//     if (error instanceof z.ZodError)
//       return new Response(error.issues[0].message, { status: 422 });

//     return new Response(error.message, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const wislistExist = await db.wishlist.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!wislistExist) {
      return new Response("No wishlist found", { status: 402 });
    }

    const wishlist = await db.wishlist.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    const wishlistOnProducts = await db.wishlistOnProducts.findMany({
      where: {
        wishlistId: wishlist?.id,
      },
      include: {
        Product: {
          include: {
            Inventory: true,
            Image: true,
          },
        },
      },
    });

    return NextResponse.json({ wishlistOnProducts });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
