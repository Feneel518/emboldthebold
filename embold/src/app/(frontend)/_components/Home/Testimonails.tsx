import CarouselNew from "@/components/Frontend/CarouselNew";
import { db } from "@/lib/db";
import { FC } from "react";

interface TestimonailsProps {}
export const revalidate = 1;
const Testimonails: FC<TestimonailsProps> = async ({}) => {
  return (
    <div className="mb-10 w-full flex flex-col items-center">
      <CarouselNew></CarouselNew>
    </div>
  );
};

export default Testimonails;
