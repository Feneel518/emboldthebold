import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { AddressValidator } from "@/lib/validators/Address";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) return new Response("UNAUTHORIZED", { status: 401 });

    const body = await req.json();

    const {
      addressLine1,
      city,
      country,
      email,
      firstName,
      isDefault,
      lastName,
      phoneNumber,
      pinCode,
      state,
      addressLine2,
      userid,
    } = AddressValidator.parse(body);

    const addressCountCheck = await db.address.count({
      where: {
        email: email,
      },
    });

    if (isDefault) {
      const addressIsDefault = await db.address.updateMany({
        where: {
          email: email,
        },
        data: {
          isDefault: false,
        },
      });
    }

    if (addressCountCheck > 7) {
      return new Response("A user can create upto 7 addresses only", {
        status: 402,
      });
    }

    const address = await db.address.create({
      data: {
        addressLine1,
        city,
        country,
        email,
        firstName,
        lastName,
        pinCode,
        state,
        addressLine2,
        isDefault,
        phoneNumber,
        user: {
          connect: {
            email: email,
          },
        },
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not add a banner, please try again later", {
      status: 500,
    });
  }
}
