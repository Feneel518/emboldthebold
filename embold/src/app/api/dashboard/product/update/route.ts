import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validators/ProductValidator";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      name,
      description,
      categoryIds,
      isActive,
      colourValues,
      sizeValues,
      inventory,
      images,
      showOnHome,
    } = ProductValidator.parse(body);

    // Separating size and colours
    const sizeColour = inventory.map((item) => {
      return item.subProductName.split(" | ");
    });

    const inventories = await db.inventory.findMany({
      where: {
        productId: id,
      },
      select: {
        Sku: true,
      },
    });

    const inventryToDisconect = inventories.filter((a) => {
      return !inventory.find((el) => {
        return a.Sku === el.Sku;
      });
    });

    if (inventryToDisconect.length > 0) {
      const disconnectedInventories = await db.product.update({
        where: {
          id: id,
        },
        data: {
          Inventory: {
            disconnect: inventory.map((i) => {
              return {
                Sku: i.Sku,
              };
            }),
          },
        },
      });
    }

    // // // deleting the images
    await db.image.deleteMany({
      where: {
        productId: id,
      },
    });

    // create colours for database is not already created
    if (colourValues) {
      if (colourValues.length !== 0) {
        for (let i = 0; i < colourValues.length; i++) {
          const exist = await db.attributeValue.findUnique({
            where: {
              value: colourValues[i].value,
            },
          });
          if (!exist) {
            await db.attributeValue.create({
              data: {
                value: colourValues[i].value,
                name: colourValues[i].label,
                attribute: {
                  connect: {
                    id: "64b02dc2bec8c50398ef5f9c",
                  },
                },
              },
            });
          }
        }
      }
    }

    // create size for database is not already created
    if (sizeValues) {
      if (sizeValues?.length !== 0) {
        for (let i = 0; i < sizeValues.length; i++) {
          const exist = await db.attributeValue.findUnique({
            where: {
              value: sizeValues[i].replace(/ /g, ""),
            },
          });

          if (!exist) {
            await db.attributeValue.create({
              data: {
                value: sizeValues[i].replace(/ /g, ""),
                attribute: {
                  connect: {
                    id: "64b02db7bec8c50398ef5f9b",
                  },
                },
              },
            });
          }
        }
      }
    }

    if (categoryIds.length > 0) {
      await db.categoriesOnProducts.deleteMany({
        where: {
          productId: id,
        },
      });
      const cateIds = categoryIds.map((cateIds) => {
        return {
          category: {
            connect: {
              id: cateIds,
            },
          },
        };
      });

      await db.product.update({
        where: {
          id: id,
        },
        data: {
          categoriesOnProducts: {
            create: cateIds,
          },
        },
      });
    }

    const additionOfInventory = await db.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        isActive: isActive ? true : false,
        showOnHome: showOnHome,
        size: sizeValues,
        colour: colourValues,
        Image: {
          create: images.map((img) => {
            return {
              altText: `${name} ${sizeColour}`,
              url: img,
            };
          }),
        },
        Inventory: {
          upsert: inventory.map((inv, index) => {
            return {
              where: {
                Sku: inv.Sku,
              },
              update: {
                price: inv.price,
                discountedPrice: inv.discountedPrice,
                Quantity: {
                  update: {
                    quantity: inv.quantity,
                  },
                },
              },
              create: {
                price: inv.price,
                Sku: inv.Sku,
                discountedPrice: inv.discountedPrice,
                Quantity: {
                  create: {
                    quantity: inv.quantity,
                  },
                },

                AttributesOnInventory: {
                  create: sizeColour[index].map((attr) => {
                    return {
                      attributeValue: {
                        connect: {
                          value: attr.replace(/ /g, ""),
                        },
                      },
                    };
                  }),
                },
              },
            };
          }),
        },
      },
      include: {
        Inventory: true,
      },
    });

    // // // updating the product with the new added inventory
    // await db.product.update({
    //   where: {
    //     id: id,
    //   },
    //   data: {
    //     name,
    //     description,
    //     slug: name
    //       .toLowerCase()
    //       .trim()
    //       .replace(/[^\w\s-]/g, "")
    //       .replace(/[\s_-]+/g, "-")
    //       .replace(/^-+|-+$/g, ""),
    //     isActive: isActive ? true : false,
    //     showOnHome: showOnHome,
    //     size: sizeValues,
    //     colour: colourValues,
    //     Inventory: {
    //       upsert: inve,
    //     },
    //     Image: {
    //       create: images.map((image) => {
    //         return {
    //           url: image,
    //           altText: name,
    //         };
    //       }),
    //     },
    //   },
    // });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    console.log(error);

    return new Response("Could not update category, please try again later", {
      status: 500,
    });
  }
}
