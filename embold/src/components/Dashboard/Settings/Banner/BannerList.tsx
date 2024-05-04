"use client";

import { db } from "@/lib/db";
import Image from "next/image";
import { FC } from "react";
import BannerButton from "./BannerButton";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Banner } from "@prisma/client";

interface BannerListProps {}
export const dynamic = "force-dynamic";

const BannerList: FC<BannerListProps> = ({}) => {
  const { data: banner, isLoading: loadingData } = useQuery({
    queryKey: ["BannerData"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/banner/fetchActive");
      return data.banner as Banner[];
    },
  });
  return (
    <div className="mt-10">
      <Separator className="mb-10 opacity-25"></Separator>
      {banner ? (
        <div className=" grid grid-cols-1 lg:grid-cols-2  gap-4">
          {banner.map((url) => {
            return (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className=" rounded-md  overflow-hidden">
                  <Image
                    className="hover:shadow-xl rounded-md w-[400px] h-[250px] object-cover hover:scale-110 transition-all duration-150 ease-in-out"
                    src={url.image}
                    alt="Banner-image"
                    width={200}
                    height={200}
                  ></Image>
                </div>
                <BannerButton id={url.id}></BannerButton>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="">No banners </div>
      )}
    </div>
  );
};

export default BannerList;
