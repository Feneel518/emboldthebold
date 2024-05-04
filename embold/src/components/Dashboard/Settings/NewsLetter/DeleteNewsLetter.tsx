"use client";

import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import axios from "axios";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";

interface DeleteNewsLetterProps {
  id: string;
}

const DeleteNewsLetter: FC<DeleteNewsLetterProps> = ({ id }) => {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    const payload = {
      id,
    };
    const { data } = await axios.post(`/api/newsletter/delete`, payload);

    if (data === "OK") {
      toast.success("Deleted.", {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#13505B",
          color: "white",
          fontSize: "16px",
        },
      });

      router.refresh();
    }
  };
  return (
    <div
      className={clsx(
        buttonVariants({ variant: "destructive" }),
        "cursor-pointer"
      )}
    >
      <Trash className={""} onClick={() => handleDelete(id)}></Trash>
    </div>
  );
};

export default DeleteNewsLetter;
