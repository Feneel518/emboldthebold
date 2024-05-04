import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validators/CategoryValidtor";
import { z } from "zod";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { isActive, name, parentId, showOnHome, image, id } =
      CategoryValidator.parse(body);

    if (id === parentId) {
      return new Response("Category cannot be a parent category of it self", {
        status: 408,
      });
    }

    const parentCategoryCheck = await db.category.findFirst({
      where: {
        id: id,
      },
      include: {
        subCategory: {
          select: { id: true },
        },
      },
    });

    if (showOnHome) {
      const onHomeCheck = await db.category.findMany({
        where: {
          showOnHome: true,
        },
      });

      if (onHomeCheck.length > 6) {
        return new Response(
          "Already 6 categories are on homepage, cannot add more",
          {
            status: 411,
            statusText: "Already 6 categories are on homepage, cannot add more",
          }
        );
      }

      if (parentCategoryCheck?.image === "") {
        return new Response(
          "No image found in this category, So cannot add this category to homepage.",
          { status: 412 }
        );
      }
    }

    const check = parentCategoryCheck?.subCategory
      .map((sub) => (sub.id === parentId ? true : false))
      .includes(true);

    if (check) {
      return new Response(
        "Cannot update as subcategory already has this category as parent",
        { status: 409 }
      );
    }

    const updated = await db.category.updateMany({
      where: {
        id: id,
      },

      data: {
        name,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        parentId:
          parentId === "" || parentId === "No Category" ? null : parentId,
        image,
        isActive,
        showOnHome,
      },
    });

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
