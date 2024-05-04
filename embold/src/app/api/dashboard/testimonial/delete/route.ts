import { db } from "@/lib/db";
import { TestimonialDeleteValidator } from "@/lib/validators/Testimonials";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id } = TestimonialDeleteValidator.parse(body);

    await db.testimonial.delete({
      where: {
        id: id,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.log(error);

    return new Response(
      "Could not delete your testimonial, please try again later",
      {
        status: 500,
      }
    );
  }
}
