"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

import { FC } from "react";
import { toast } from "sonner";

interface BannerButtonProps {
  id: string;
}

const BannerButton: FC<BannerButtonProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleDelete = async (id: string) => {
    const payload = { id };
    try {
      const { data } = await axios.post(
        "/api/dashboard/banner/delete",
        payload
      );
      queryClient.invalidateQueries({ queryKey: ["BannerData"] });
      router.refresh();

      return data as string;
    } catch (error) {
      toast.error("Could not delete the banner, please try again later", {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#F07167",
          color: "white",
          fontSize: "16px",
        },
      });
    }
  };
  return (
    <div className="w-full">
      <Button
        className="w-full"
        variant={"destructive"}
        onClick={() => handleDelete(id)}
      >
        Delete
      </Button>
    </div>
  );
};

export default BannerButton;
