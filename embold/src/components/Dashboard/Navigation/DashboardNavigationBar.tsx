import Greetings from "@/components/Utilities/Greetings";
import { FC } from "react";

interface DashboardNavigationBarProps {}

const DashboardNavigationBar: FC<DashboardNavigationBarProps> = ({}) => {
  return (
    <div className="bg-emboldBlack p-4 max-lg:ml-20 rounded-lg flex items-center justify-between max-md:w-[70%] mb-10">
      <div className="">
        <Greetings
          className="text-emboldLight text-xl"
          //   session={session}
        ></Greetings>
      </div>
      {/* <NotificationBell></NotificationBell> */}
    </div>
  );
};

export default DashboardNavigationBar;
