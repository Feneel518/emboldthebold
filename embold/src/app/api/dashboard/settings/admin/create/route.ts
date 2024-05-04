import { db } from "@/lib/db";
import { AdminValidator } from "@/lib/validators/Admin";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email } = AdminValidator.parse(body);

    if (!email) {
      return new Response("No Email", { status: 404 });
    }

    const emailExist = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!emailExist) {
      return new Response("Email Doesnt exist in database", { status: 401 });
    }

    if (emailExist) {
      await db.user.update({
        where: {
          email: email,
        },
        data: {
          isAdmin: true,
        },
      });
    }

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
