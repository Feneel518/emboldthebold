"use client";

import DeleteModal from "@/components/Helpers/DeleteModal";
import { colours } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC } from "react";

interface ColourListProps {}

const ColourList: FC<ColourListProps> = ({}) => {
  const { data: admin, isLoading } = useQuery({
    queryKey: ["dashboardColour"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/settings/colour/fetch");
      return data.colour as colours[];
    },
  });

  return (
    <div className="mt-10">
      <h3 className="mb-4">List of Colours</h3>
      <hr className="mb-4 w-40 border-emboldLight/20" />
      <div className="flex w-full flex-col gap-2">
        {admin?.map((adm) => {
          const colo = adm.value;
          return (
            <div className="flex items-center justify-between gap-4">
              <div
                key={adm.id}
                className="grid grid-cols-3 gap-10 items-start justify-start w-[300px]"
              >
                <div className="">{adm.label}</div>
                <div className="">{adm.value}</div>
                <div
                  className="border-white border w-8 h-8 rounded-full"
                  style={{ backgroundColor: colo }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColourList;
