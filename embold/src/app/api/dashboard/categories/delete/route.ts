import { db } from "@/lib/db";
import { DeleteValidator } from "@/lib/validators/DeleteValidator";
import { log } from "handlebars";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = DeleteValidator.parse(body);

    const categoryExists = await db.category.findFirst({
      where: {
        id,
      },
      include: {
        subCategory: true,
        CategoriesOnProducts: true,
        FifthSection: true,
        FirstSection: true,
        FourthSection: true,
        SecondSection: true,
        ThirdSection: true,
      },
    });

    if (!categoryExists)
      return new Response("No category found with this id", { status: 400 });

    if (categoryExists.subCategory.length !== 0)
      return new Response(
        "It is a parent category, delete it's subcategories first",
        {
          status: 401,
          statusText:
            "It is a parent category, delete it's subcategories first",
        }
      );

    if (categoryExists.CategoriesOnProducts.length > 0) {
      return new Response(
        "This category contains some products, please remove those products first to delete this category",
        {
          status: 402,
          statusText:
            "This category contains some products, please remove those products first to delete this category",
        }
      );
    }

    if (
      categoryExists.FifthSection ||
      categoryExists.FirstSection ||
      categoryExists.FourthSection ||
      categoryExists.SecondSection ||
      categoryExists.ThirdSection
    ) {
      return new Response(
        "Cannot delete this category, as it's displayed on the home page.",
        {
          status: 403,
          statusText:
            "Cannot delete this category as it's been displayed on the homepage. To delete go to settings home page and remove the category from the option.",
        }
      );
    }

    await db.category.delete({
      where: {
        id,
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
