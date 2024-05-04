import { db } from "@/lib/db";
import { TestimonialValidator } from "@/lib/validators/Testimonials";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, comment, image } = TestimonialValidator.parse(body);

    await db.testimonial.create({
      data: {
        comment,
        image: image ? image : "",
        name,
      },
    });

    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    console.log(error);

    return new Response(
      "Could not add your testimonial, please try again later",
      {
        status: 500,
      }
    );
  }
}
