import { db } from "@/lib/db";
import { SectionValidator } from "@/lib/validators/Sections";
import { z } from "zod";

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      firstSection,
      secondSection,
      thirdSection,
      fifthSection,
      fourthSection,
      fifthActive,
      firstActive,
      fourthActive,
      secondActive,
      thirdActive,
    } = SectionValidator.parse(body);

    if (firstSection) {
      const id = await db.firstSection.findFirst({});

      if (!id) {
        await db.firstSection.create({
          data: {
            isActive: firstActive,
            category: {
              connect: {
                id: firstSection,
              },
            },
          },
        });
      }

      if (!firstActive) {
        await db.firstSection.delete({
          where: {
            id: id?.id,
          },
        });
      } else {
        await db.firstSection.update({
          where: {
            id: id?.id,
          },
          data: {
            isActive: firstActive,
            category: {
              connect: {
                id: firstSection,
              },
            },
          },
        });
      }
    }

    if (secondSection) {
      const id = await db.secondSection.findFirst({});
      if (!id) {
        await db.secondSection.create({
          data: {
            isActive: secondActive,
            category: {
              connect: {
                id: secondSection,
              },
            },
          },
        });
      }

      if (!secondActive) {
        await db.secondSection.delete({
          where: {
            id: id?.id,
          },
        });
      } else {
        await db.secondSection.update({
          where: {
            id: id?.id,
          },
          data: {
            isActive: secondActive,
            category: {
              connect: {
                id: secondSection,
              },
            },
          },
        });
      }
    }
    if (thirdSection) {
      const id = await db.thirdSection.findFirst({});
      if (!id) {
        await db.thirdSection.create({
          data: {
            isActive: thirdActive,
            category: {
              connect: {
                id: thirdSection,
              },
            },
          },
        });
      }

      if (!thirdActive) {
        await db.thirdSection.delete({
          where: {
            id: id?.id,
          },
        });
      } else {
        await db.thirdSection.update({
          where: {
            id: id?.id,
          },
          data: {
            isActive: thirdActive,
            category: {
              connect: {
                id: thirdSection,
              },
            },
          },
        });
      }
    }
    if (fourthSection) {
      const id = await db.fourthSection.findFirst({});
      if (!id) {
        await db.fourthSection.create({
          data: {
            isActive: fourthActive,
            category: {
              connect: {
                id: fourthSection,
              },
            },
          },
        });
      }

      if (!fourthActive) {
        await db.fourthSection.delete({
          where: {
            id: id?.id,
          },
        });
      } else {
        await db.fourthSection.update({
          where: {
            id: id?.id,
          },
          data: {
            isActive: fourthActive,
            category: {
              connect: {
                id: fourthSection,
              },
            },
          },
        });
      }
    }
    if (fifthSection) {
      const id = await db.fifthSection.findFirst({});
      if (!id) {
        await db.fifthSection.create({
          data: {
            isActive: fifthActive,
            category: {
              connect: {
                id: fifthSection,
              },
            },
          },
        });
      }

      if (!fifthActive) {
        await db.fifthSection.delete({
          where: {
            id: id?.id,
          },
        });
      } else {
        await db.fifthSection.update({
          where: {
            id: id?.id,
          },
          data: {
            isActive: fifthActive,
            category: {
              connect: {
                id: fifthSection,
              },
            },
          },
        });
      }
    }

    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    console.log(error);

    return new Response("Could not delete, please try again later", {
      status: 500,
    });
  }
}
