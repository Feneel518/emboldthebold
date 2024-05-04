import { db } from "@/lib/db";
import { transporter } from "@/lib/email/email";
import { RegisterValidator } from "@/lib/validators/Resgister";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, name, password, phoneNumber } =
      RegisterValidator.parse(body);

    const hashed = await hash(password, 12);

    const existingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser)
      return new Response("Email already exist", {
        status: 402,
        statusText: "Email Already exist, Please use a new Email Id.",
      });

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        name,
        phoneNumber,
      },
    });

    const bigToken = randomUUID() + "" + randomUUID();

    const token = await db.activateToken.create({
      data: {
        token: bigToken.replace(/-/g, ""),
        userId: user.id,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Embold Registeration",
      // text: `Hello ${user.name}, please activate your account by clicking this link: ${process.env.HOST}/activate/${token.token}`,
      html: `<p>Hi ${user.name}</p>
      
      <p>Please verify your email and activate your Embold Account by clicking here ${process.env.HOST}/activate/${token.token}. </p>
      <p>This link is only valid for 4 hours.</p>

      <p>Team Embold!</p>
      <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
      `,
    });

    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    console.log(error);

    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
