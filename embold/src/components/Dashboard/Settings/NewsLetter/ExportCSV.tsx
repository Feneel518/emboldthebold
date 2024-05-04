"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Customers } from "@/types/Customers";
import { NewsLetter } from "@prisma/client";
import { FC } from "react";

import { CSVLink } from "react-csv";

interface ExportCSVProps {
  data: NewsLetter[] | Customers[];
}

const ExportCSV: FC<ExportCSVProps> = ({ data }) => {
  return (
    <div className="">
      <CSVLink
        data={data}
        filename="Subscribers"
        className={cn(buttonVariants({ variant: "link" }), "text-emboldLight")}
      >
        Export list
      </CSVLink>
    </div>
  );
};

export default ExportCSV;
