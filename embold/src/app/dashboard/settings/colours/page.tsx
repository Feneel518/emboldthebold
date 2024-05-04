import ColourForm from "@/components/Dashboard/Settings/Colour/ColourForm";
import ColourList from "@/components/Dashboard/Settings/Colour/ColourList";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h1 className="mb-1 text-xl">Admin Authorization</h1>
          <Separator></Separator>
        </div>
      </div>

      <ColourForm></ColourForm>
      <ColourList></ColourList>
      {/* <AdminAutho></AdminAutho>
  <AdminList></AdminList> */}
    </div>
  );
};

export default page;
