import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validators/ProductValidator";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
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

    // to separate size and colour values
    const sizeColour = inventory.map((item) => {
      return item.subProductName.split(" | ");
    });

    // model to store inventory data from products model
    const invent = inventory.map((items, index) => {
      return {
        price: items.price,
        discountedPrice: items.discountedPrice,
        Sku: items.Sku,
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
        Quantity: {
          create: { quantity: items.quantity },
        },
      };
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

    // model to store categories from products model
    const cateIds = categoryIds.map((cateIds) => {
      return {
        category: {
          connect: {
            id: cateIds,
          },
        },
      };
    });

    await db.product.create({
      data: {
        name,
        description,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        isActive: isActive,
        showOnHome: showOnHome,
        size: sizeValues,
        colour: colourValues,
        Inventory: {
          create: invent,
        },
        categoriesOnProducts: {
          create: cateIds,
        },
        Image: {
          create: images.map((image) => {
            return {
              url: image,
              altText: name,
            };
          }),
        },
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
