import { db } from "@/lib/db";
import { ResetValidator } from "@/lib/validators/ResetPassword";
import { hash } from "bcrypt";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { confirmPassword, password, token } = ResetValidator.parse(body);

    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    if (!passwordResetToken)
      return new Response("Invalid token reset request", {
        status: 402,
        statusText: "No token found, please try resetting again.",
      });

    if (
      passwordResetToken?.createdAt < new Date(Date.now() - 1000 * 60 * 60 * 4)
    ) {
      return new Response("Token invalid", {
        status: 403,
        statusText: "Token is invalid, please try resetting the password again",
      });
    }

    if (passwordResetToken.isReset) {
      return new Response("Token has been used", {
        status: 405,
        statusText: "Token has already been used.",
      });
    }

    const encryptedPass = await hash(password, 12);

    const updateUser = await db.user.update({
      where: {
        id: passwordResetToken.userId,
      },
      data: {
        password: encryptedPass,
      },
    });

    const updateToken = await db.passwordResetToken.update({
      where: {
        id: passwordResetToken.id,
      },
      data: {
        isReset: true,
        reset: new Date(),
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
