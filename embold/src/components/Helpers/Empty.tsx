import { FC } from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import MaxWidthWrapper from "../Utilities/MaxWidthWrapper";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyProps {}

const Empty: FC<EmptyProps> = ({}) => {
  return (
    <div className="mt-4 text-emboldBlack/50 ">
      <MaxWidthWrapper>
        <Separator className="bg-emboldBlack"></Separator>
        <div className="flex w-full h-full items-center justify-center">
          <h1 className="text-2xl my-10">
            Sorry, there are no products for this category, We&apos;ll be adding
            new products soon.
          </h1>
        </div>
        <Link
          href={"/"}
          className={cn(
            buttonVariants({ variant: "linkBlack" }),
            "flex items-center gap-1"
          )}
        >
          <ChevronLeft className="w-4 h-4"></ChevronLeft> Go back to home page
        </Link>
      </MaxWidthWrapper>
    </div>
  );
};

export default Empty;
