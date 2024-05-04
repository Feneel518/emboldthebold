import { Icons } from "@/components/Utilities/Icons";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Success from "../../../../../public/success.png";
import { ChevronRight } from "lucide-react";
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="mt-20  ">
      <MaxWidthWrapper>
        <div className="relative  mb-20 ">
          <div className="hidden md:block h-80 overflow-hidden lg:absolute lg:h-[400px] lg:w-1/2 lg:pr-4 xl:pr-12">
            <Image
              fill
              src={Success}
              alt="Thank you for your order"
              className="w-full h-full object-cover object-center"
            ></Image>
          </div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-31 xl:gap-x-24">
            <div className="lg:col-start-2">
              <p className="text-sm font-medium text-embold">
                Order successful
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Thanks for your purchase
              </h1>
              <Link
                href={"/orders"}
                className={`flex items-center pl-0 mt-4 ${buttonVariants({
                  variant: "linkBlack",
                })}`}
              >
                Go to Orders <ChevronRight className="w-4 h-4"></ChevronRight>
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
