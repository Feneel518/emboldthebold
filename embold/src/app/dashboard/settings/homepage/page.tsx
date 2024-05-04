import Homepage from "@/components/Dashboard/Settings/Homepage/Homepage";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  const categories = await db.category.findMany({
    where: {
      isActive: true,
    },
  });

  const firstSection = await db.firstSection.findFirst();
  const secondSection = await db.secondSection.findFirst();
  const thirdSection = await db.thirdSection.findFirst();
  const fourthSection = await db.fourthSection.findFirst();
  const fifthSection = await db.fifthSection.findFirst();
  return (
    <Homepage
      // @ts-ignore
      categories={categories}
      // @ts-ignore
      first={firstSection}
      // @ts-ignore
      second={secondSection}
      // @ts-ignore
      third={thirdSection}
      // @ts-ignore
      fourth={fourthSection}
      // @ts-ignore
      fifth={fifthSection}
    ></Homepage>
  );
};

export default page;
