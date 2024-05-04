import Loading from "@/components/Helpers/Loading";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { Skeleton } from "@/components/ui/skeleton";

import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <MaxWidthWrapper>
      <div className="flex items-start justify-start gap-20 my-20">
        <div className="">
          <Skeleton className="w-[700px] h-[600px]"></Skeleton>
        </div>
        <div className=" flex flex-col gap-4">
          <Skeleton className="w-96 h-4"></Skeleton>
          <Skeleton className="w-64 h-4"></Skeleton>
          <Skeleton className="w-72 h-8"></Skeleton>
          <Skeleton className="w-40 h-4"></Skeleton>
          <Skeleton className="w-24 h-10"></Skeleton>
          <Skeleton className="w-72 h-4"></Skeleton>
          <Skeleton className="w-80 h-24"></Skeleton>
          <Skeleton className="w-96 h-4"></Skeleton>
          <Skeleton className="w-64 h-6"></Skeleton>
          <Skeleton className="w-40 h-4"></Skeleton>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default loading;
