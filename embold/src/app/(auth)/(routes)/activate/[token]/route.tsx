import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  const user = await db.user.findFirst({
    where: {
      ActivateToken: {
        some: {
          AND: [
            {
              createdAt: {
                gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
            {
              token,
            },
            {
              activated: false,
            },
          ],
        },
      },
    },
  });

  if (!user) {
    return new Response("Invalid Token");
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      active: true,
    },
  });

  await db.activateToken.update({
    where: {
      token,
    },
    data: {
      activatedAt: new Date(),
    },
  });

  redirect("/sign-in");
}
