import ProductFeed from "@/components/Frontend/ProductFeed";
import { db } from "@/lib/db";
import { FC } from "react";

interface ProductsProps {}
export const revalidate = 1;
const Products: FC<ProductsProps> = async ({}) => {
  const first = await db.firstSection.findFirst({
    where: {
      isActive: true,
    },
    select: {
      categoryId: true,
    },
  });
  const second = await db.secondSection.findFirst({
    where: {
      isActive: true,
    },
    select: {
      categoryId: true,
    },
  });
  const third = await db.thirdSection.findFirst({
    where: {
      isActive: true,
    },
    select: {
      categoryId: true,
    },
  });
  const fourth = await db.fourthSection.findFirst({
    where: {
      isActive: true,
    },
    select: {
      categoryId: true,
    },
  });
  const fifth = await db.fifthSection.findFirst({
    where: {
      isActive: true,
    },
    select: {
      categoryId: true,
    },
  });

  return (
    <div className="w-full flex flex-col gap-10">
      {first && <ProductFeed id={first.categoryId}></ProductFeed>}
      {second && <ProductFeed id={second.categoryId}></ProductFeed>}
      {third && <ProductFeed id={third.categoryId}></ProductFeed>}
      {fourth && <ProductFeed id={fourth.categoryId}></ProductFeed>}
      {fifth && <ProductFeed id={fifth.categoryId}></ProductFeed>}
    </div>
  );
};

export default Products;
