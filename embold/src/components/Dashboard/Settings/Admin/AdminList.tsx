"use client";

import DeleteModal from "@/components/Helpers/DeleteModal";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";
import { FC } from "react";

interface AdminListProps {}

const AdminList: FC<AdminListProps> = ({}) => {
  const { data: admin, isLoading } = useQuery({
    queryKey: ["dashboardAdmin"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/settings/admin/fetch");
      return data.admin as User[];
    },
  });

  return (
    <div className="mt-10">
      <h3 className="mb-4">List of admin</h3>
      <hr className="mb-4 w-40 border-emboldLight/20" />
      <div className="flex w-full flex-col gap-2">
        {admin?.map((adm) => {
          return (
            <div className="flex items-center justify-between">
              <div key={adm.id} className="flex gap-10">
                <div className="">{adm.name}</div>
                <div className="">{adm.email}</div>
              </div>
              <div className="">
                <DeleteModal
                  id={adm.email}
                  name="Admin"
                  path="settings/admin"
                ></DeleteModal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminList;
