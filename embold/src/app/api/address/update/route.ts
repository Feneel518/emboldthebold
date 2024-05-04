import { getAuthSession } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { AddressValidator } from "@/lib/validators/Address";
import { z } from "zod";

export async function PUT(req: Request) {
  try {
    const Session = await getAuthSession();

    if (!Session?.user) return new Response("UNAUTHORIZED", { status: 401 });

    const body = await req.json();

    const {
      id,
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
    } = AddressValidator.parse(body);

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

    const updateAddress = await db.address.update({
      where: {
        id: id,
      },
      data: {
        addressLine1,
        addressLine2,
        city,
        country,
        email,
        firstName,
        isDefault,
        lastName,
        phoneNumber,
        pinCode,
        state,
      },
    });
    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    console.log(error);

    return new Response("Could not add a address, please try again later", {
      status: 500,
    });
  }
}
