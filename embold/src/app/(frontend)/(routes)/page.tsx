import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import Categories from "../_components/Home/Categories";
import Products from "../_components/Home/Products";
import Testimonails from "../_components/Home/Testimonails";
import WhyChooseUs from "@/components/Frontend/WhyChooseUs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Banners from "../_components/Home/Banner";

export default async function Home() {
  return (
    <div className="lg:mt-24 mt-10 ">
      <MaxWidthWrapper>
        <div className="flex flex-col gap-10 items-center justify-start -mt-10 mb-40">
          <Suspense>
            <Banners></Banners>
          </Suspense>
          <Suspense>
            <Categories></Categories>
          </Suspense>
          <WhyChooseUs></WhyChooseUs>
          <Suspense>
            <Products></Products>
          </Suspense>
          <Suspense>
            <Testimonails></Testimonails>
          </Suspense>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
