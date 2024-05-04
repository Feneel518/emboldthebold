import { db } from "@/lib/db";
import { CategoriesOnProducts } from "@/types/CategoriesOnProducts";
import { Category } from "@/types/Category";
import { Product } from "@/types/Product";
import { RemoveDuplicate } from "./RemoveDuplicates";
import { getAuthSession } from "@/lib/auth/auth";

export const CategoryName = async (id?: string, slug?: string) => {
  if (id) {
    const categoryName = await db.category.findFirst({
      where: {
        id: id,
      },
      select: {
        name: true,
        slug: true,
      },
    });

    return categoryName;
  } else if (slug) {
    const categoryName = await db.category.findFirst({
      where: {
        slug: slug,
      },
      select: {
        name: true,
        slug: true,
      },
    });

    return categoryName;
  }
};

export const ProductFromCategoriesWithLimit = async (
  id: string,
  take?: number
) => {
  const session = await getAuthSession();
  const products = await db.product.findMany({
    where: {
      AND: [
        {
          categoriesOnProducts: {
            some: {
              category: {
                id: id,
              },
            },
          },
        },
        {
          showOnHome: true,
        },
        {
          isActive: true,
        },
      ],
    },
    select: {
      id: true,
      slug: true,
      name: true,
      Image: {
        select: {
          url: true,
        },
      },
      WishlistOnProducts: {
        where: {
          Wishlist: {
            userId: session?.user.id,
          },
        },
      },
      Inventory: {
        select: {
          discountedPrice: true,
          AttributesOnInventory: {
            include: {
              attributeValue: true,
            },
          },
          price: true,
          id: true,
          Product: {
            include: {
              Image: true,
            },
          },
          Quantity: {
            select: {
              quantity: true,
            },
          },
        },
      },
    },
    take: take,
    // include: {
    //   WishlistOnProducts: true,
    //   Image: true,
    //   Inventory: {
    //     include: {
    //       AttributesOnInventory: {
    //         include: {
    //           attributeValue: true,
    //         },
    //       },
    //       Quantity: true,
    //       Product: {
    //         select: {
    //           name: true,
    //           Image: true,
    //           slug: true,
    //           description: true,
    //         },
    //       },
    //     },
    //   },
    // },
    // take: take,
  });

  return products;
};

export const ProductFromCategories = async (slug: string, take?: number) => {
  const session = await getAuthSession();
  const products = await db.product.findMany({
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
      WishlistOnProducts: {
        where: {
          Wishlist: {
            userId: session?.user.id,
          },
        },
        // include: {
        //   Wishlist: true,
        // },
      },
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
    take: take ? take : undefined,
  });

  const subCategories = await db.category.findMany({
    where: {
      slug: slug,
    },
    take: take
      ? products.length === take
        ? 0
        : take - products.length
      : undefined,
    select: {
      subCategory: {
        include: {
          CategoriesOnProducts: {
            include: {
              product: {
                include: {
                  WishlistOnProducts: {
                    include: {
                      Wishlist: true,
                    },
                  },
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

  let prod: any = [];
  if (subCategories.length > 0)
    subCategories[0].subCategory.map((item) =>
      item.CategoriesOnProducts.map((ite) => prod.push(ite.product))
    );

  let productss = [...products, ...prod];

  const uniqueProducts = RemoveDuplicate(productss);

  return uniqueProducts;
};
