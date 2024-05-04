import Loading from "@/components/Helpers/Loading";

import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div className="w-full flex items-center justify-center lg:my-20 my-10">
      <Loading></Loading>
    </div>
  );
};

export default loading;
