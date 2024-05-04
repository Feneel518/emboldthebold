import { db } from "@/lib/db";
import { transporter } from "@/lib/email/email";
import { NewsLetterValidator } from "@/lib/validators/NewsLetter";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = NewsLetterValidator.parse(body);

    const emailExist = await db.newsLetter.findFirst({
      where: {
        email,
      },
    });

    if (emailExist) {
      return new Response("Email Already exist", { status: 401 });
    }

    await db.newsLetter.create({
      data: {
        email: email,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "EMBOLD: Newsletter Subscribed",
        html: `<p>Hi,</p>
      
          <p>Thank you for subscribing to Embold's Newsletter. You will receive an update as soon as Embold team will post any new Newsletters.
          </p>
     
          <p>If you wish to unsubscribe at any point in time, email at embold.helpdesk@gmail.com</p>
    
          <p>Team Embold!</p>
          <img src="https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png" style="width:200px"/>
          `,
      });
    } catch (error) {
      console.log(error);
    }

    return new Response("Ok");
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return new Response(error.issues[0].message, { status: 422 });

    console.log(error);

    return new Response(error.message, { status: 500 });
  }
}
