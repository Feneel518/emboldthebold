import { db } from "@/lib/db";
import { fyno, sendEmail } from "@/lib/email/FynoEmail";
import { transporter } from "@/lib/email/email";

import { ForgotValidator } from "@/lib/validators/Forgot";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { use } from "react";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = ForgotValidator.parse(body);

    if (!email)
      return new Response("No email found", {
        status: 402,
        statusText:
          "No email found, please enter email to continue resetting password.",
      });

    const emailExist = await db.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!emailExist)
      return new Response("No email found in database", {
        status: 403,
        statusText: "No user found in database, with the provided email id.",
      });

    const token = await db.passwordResetToken.create({
      data: {
        userId: emailExist.id,
        token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: emailExist.email,
      subject: "EMBOLD: Reset Password Request",
      html: `<p>Hi ${emailExist.name}</p>
      
      <p>Password Reset is requested for your Embold account. If you wish to reset your password, please click here ${process.env.HOST}/password-reset/${token.token}. </p>
      <p>This link is only valid for 4 hours.</p>

      <p>Team Embold!</p>
      <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
      `,
      // text: `Hello ${emailExist.name}, someone (hopefully you) requested a password reset for this acount. If you did want to reset your password, please click here ${process.env.HOST}/password-reset/${token.token}

      // For security reasons, this link is only valid for four hours.

      // If yoyu did not request this please ignore this mail.
      // `,
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
