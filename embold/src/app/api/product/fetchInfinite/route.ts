import { RemoveDuplicate } from "@/components/Utilities/RemoveDuplicates";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { boolean, z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { limit, page, slug, sub } = z
      .object({
        limit: z.string(),
        page: z.string(),
        slug: z.string(),
        sub: z.string().optional().nullish(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        slug: url.searchParams.get("slug"),
        sub: url.searchParams.get("sub"),
      });
    if (sub === null) {
      const products = await db.product.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
        where: {
          categoriesOnProducts: {
            some: {
              category: {
                slug: slug,
              },
              product: {
                isActive: true,
                deleted: false,
              },
            },
          },
        },
        include: {
          Image: true,
          Inventory: {
            include: {
              AttributesOnInventory: {
                include: {
                  attributeValue: true,
                },
              },
              Quantity: true,
              Product: {
                select: {
                  name: true,
                  Image: true,
                  slug: true,
                },
              },
            },
          },
        },
      });

      let subPage = 0;

      if (products.length < parseInt(limit)) {
        const take = parseInt(limit) - products.length;

        const subCategories = await db.category.findMany({
          where: {
            slug: slug,
          },
          take: take,
          skip: subPage * take,
          select: {
            subCategory: {
              include: {
                CategoriesOnProducts: {
                  include: {
                    product: {
                      include: {
                        Image: true,
                        Inventory: {
                          include: {
                            AttributesOnInventory: {
                              include: {
                                attributeValue: true,
                              },
                            },
                            Quantity: true,
                            Product: {
                              select: {
                                name: true,
                                Image: true,
                                slug: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        // let prod: any = [];
        // if (subCategories.length > 0)
        //   subCategories[0].subCategory.map((item) =>
        //     item.CategoriesOnProducts.map((ite) => prod.push(ite.product))
        //   );

        // let productss = [...products, ...prod];

        // const uniqueProducts = RemoveDuplicate(productss);
      }

      // const subCategories = await db.category.findMany({
      //   where: {
      //     slug: slug,
      //   },
      //   take: take
      //     ? products.length === take
      //       ? 0
      //       : take - products.length
      //     : undefined,
      //   select: {
      //     subCategory: {
      //       include: {
      //         CategoriesOnProducts: {
      //           include: {
      //             product: {
      //               include: {
      //                 Image: true,
      //                 Inventory: {
      //                   include: {
      //                     AttributesOnInventory: {
      //                       include: {
      //                         attributeValue: true,
      //                       },
      //                     },
      //                     Quantity: true,
      //                     Product: {
      //                       select: {
      //                         name: true,
      //                         Image: true,
      //                         slug: true,
      //                       },
      //                     },
      //                   },
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // });

      // let prod: any = [];
      // if (subCategories.length > 0)
      //   subCategories[0].subCategory.map((item) =>
      //     item.CategoriesOnProducts.map((ite) => prod.push(ite.product))
      //   );

      // let productss = [...products, ...prod];

      // const uniqueProducts = RemoveDuplicate(productss);

      return NextResponse.json({ products });
    }

    return new Response("OK");

    // const product = await db.product.findMany({
    //   take: parseInt(limit),
    //   skip: (parseInt(page) - 1) * parseInt(limit),
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    //   // where: {
    //   //   Inventory: {
    //   //     some: {
    //   //       Quantity: {
    //   //         quantity: {
    //   //           gt: 0,
    //   //         },
    //   //       },
    //   //     },
    //   //   },
    //   // },
    //   where: {
    //     deleted: false,
    //   },
    //   include: {
    //     categoriesOnProducts: {
    //       include: {
    //         category: true,
    //       },
    //     },
    //     Image: true,
    //     Inventory: {
    //       include: {
    //         Quantity: true,
    //         AttributesOnInventory: {
    //           include: {
    //             attributeValue: {
    //               include: {
    //                 attribute: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // return NextResponse.json({ product });
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    return new Response(error.message, { status: 500 });
  }
}
