import Loading from "@/components/Helpers/Loading";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { Skeleton } from "@/components/ui/skeleton";

import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <MaxWidthWrapper>
      <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-8 lg:my-20 my-10">
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
        <div className="flex flex-col  space-y-4">
          <Skeleton className="h-[100px] lg:h-[315px] w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[200px] bg-emboldLight50/50" />
          <Skeleton className="h-4 w-[250px] bg-emboldLight50/50" />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default loading;
