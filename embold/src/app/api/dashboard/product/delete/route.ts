import { db } from "@/lib/db";
import { ProductDeleteValidator } from "@/lib/validators/ProductValidator";
import { uuid } from "uuidv4";

import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = ProductDeleteValidator.parse(body);

    const productExist = await db.product.findFirst({
      where: {
        id,
      },
      include: {
        categoriesOnProducts: true,
        Image: true,
        Inventory: true,
      },
    });

    if (!productExist)
      return new Response("No product found with this id.", {
        status: 400,
      });

    if (productExist.Inventory.length === 0) {
      return new Response("No product inventory exist", {
        status: 401,
      });
    }

    await db.product.update({
      where: {
        id: id,
      },
      data: {
        categoriesOnProducts: {
          deleteMany: {
            productId: id,
          },
        },
      },
    });

    const deleted = await db.product.update({
      where: {
        id,
      },
      data: {
        deleted: true,
        slug: uuid(),
      },
    });
    // await db.product.update({
    //   where: {
    //     id,
    //   },
    //   data: {
    //     Inventory: {
    //       set: [],
    //     },
    //     Image: {
    //       set: [],
    //     },
    //     categoriesOnProducts: {
    //       deleteMany: {
    //         productId: id,
    //       },
    //     },
    //   },
    // });

    // const productExist = await db.product.findFirst({
    //   where: {
    //     id: id,
    //   },
    //   include: {
    //     categoriesOnProducts: true,
    //     Inventory: {
    //       include: {
    //         AttributesOnInventory: true,
    //       },
    //     },
    //     // Wishlist: true,
    //   },
    // });

    // if (!productExist) {
    //   return new Response("No product found with this id.", {
    //     status: 400,
    //   });
    // }

    // // if (productExist.Wishlist) {
    // //   await db.wishlist.deleteMany({
    // //     where: {
    // //       productId: id,
    // //     },
    // //   });
    // // }

    // if (productExist.Inventory) {
    //   await db.attributesOnInventory.deleteMany({
    //     where: {
    //       inventory: {
    //         productId: id,
    //       },
    //     },
    //   });

    //   await db.quantity.deleteMany({
    //     where: {
    //       inventory: {
    //         productId: id,
    //       },
    //     },
    //   });
    // }

    // if (productExist.categoriesOnProducts) {
    //   await db.categoriesOnProducts.deleteMany({
    //     where: {
    //       productId: id,
    //     },
    //   });
    // }

    // if (productExist.Inventory) {
    //   await db.inventory.deleteMany({
    //     where: {
    //       productId: id,
    //     },
    //   });
    // }

    // await db.product.delete({
    //   where: {
    //     id: id,
    //   },
    // });

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
