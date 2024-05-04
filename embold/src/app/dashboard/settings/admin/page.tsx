import AdminAddForm from "@/components/Dashboard/Settings/Admin/AdminAddForm";
import AdminList from "@/components/Dashboard/Settings/Admin/AdminList";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = ({}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h1 className="mb-1 text-xl">Admin Authorization</h1>
          <Separator></Separator>
        </div>
      </div>

      <AdminAddForm></AdminAddForm>
      <AdminList></AdminList>
      {/* <AdminAutho></AdminAutho>
      <AdminList></AdminList> */}
    </div>
  );
};

export default page;
