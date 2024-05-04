import { db } from "@/lib/db";
import { ColourValidator } from "@/lib/validators/Colour";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { label, value } = ColourValidator.parse(body);

    const valueCheck = value.length === 7;

    const colourHexExist = await db.colours.findFirst({
      where: {
        value: value,
      },
    });

    if (colourHexExist)
      return new Response("Colour already exist", { status: 401 });
    if (!valueCheck) {
      return new Response("Hex must be of 7 digits including the # value", {
        status: 402,
      });
    }
    await db.colours.create({
      data: {
        label,
        value,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not update the admin, please try again later", {
      status: 500,
    });
  }
}
