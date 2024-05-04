import { Loader2 } from "lucide-react";
import { FC } from "react";

interface LoadingProps {}

const Loading: FC<LoadingProps> = ({}) => {
  return (
    <div className="flex items-center gap-2 text-3xl">
      <Loader2 className="animate-spin w-8 h-8"></Loader2> Loading...
    </div>
  );
};

export default Loading;
