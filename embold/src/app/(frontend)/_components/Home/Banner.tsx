"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "@prisma/client";
// import { Banner } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

interface BannerProps {}

export const revalidate = 1;

const Banners: FC<BannerProps> = ({}) => {
  const router = useRouter();

  const { data: banners, isLoading: loadingData } = useQuery({
    queryKey: ["BannerData"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/banner/fetchActive");
      return data.banner as Banner[];
    },
  });

  if (loadingData)
    return (
      <div className="flex items-center justify-center my-10">
        {/* <Skeleton className="h-[400px] w-[90%]"></Skeleton> */}
        <Skeleton className="h-[700px] w-[1376px] bg-emboldLight50/50" />
      </div>
    );
  else if (!banners) return <div className="">No banner</div>;

  return (
    <div className="mt-16 lg:mt-10 rounded-xl shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]">
      <Carousel
        className="w-full h-full"
        infiniteLoop
        autoPlay
        showThumbs={false}
        stopOnHover={false}
        interval={3000}
        showStatus={false}
        showIndicators={banners.length === 1 ? false : true}
        renderArrowPrev={(clickHandler, hasPrev) => {
          if (banners.length === 1) {
            return null;
          } else {
            return (
              <div
                className={`${
                  hasPrev ? "absolute" : "hidden"
                } hidden top-0 bottom-0 left-0 lg:flex justify-center items-center p-3 opacity-30 hover:opacity-100 cursor-pointer z-20`}
                onClick={clickHandler}
              >
                <ChevronLeft className="w-9 h-9 text-white bg-emboldBlack rounded-full" />
              </div>
            );
          }
        }}
        renderArrowNext={(clickHandler, hasNext) => {
          if (banners.length === 1) {
            return null;
          } else {
            return (
              <div
                className={`${
                  hasNext ? "absolute" : "hidden"
                } hidden top-0 bottom-0 right-0 lg:flex justify-center items-center p-3 opacity-30 hover:opacity-100 cursor-pointer z-20 `}
                onClick={clickHandler}
              >
                <ChevronRight className="w-9 h-9 text-white bg-emboldBlack rounded-full" />
              </div>
            );
          }
        }}
      >
        {banners.map((banner) => {
          return (
            <div className="">
              <div
                key={banner.id}
                onClick={() =>
                  banner.link && router.push(`/category/${banner.link}`)
                }
                className="w-full h-full overflow-hidden cursor-pointer md:hidden"
              >
                <Image
                  className="  w-full h-[500px] lg:h-[700px] aspect-video rounded-xl object-cover "
                  src={banner.mobileImage ? banner.mobileImage : banner.image}
                  alt="Banner image"
                  width={1376}
                  height={700}
                  quality={70}
                  priority
                ></Image>
              </div>
              <div
                key={banner.id}
                onClick={() =>
                  banner.link && router.push(`/category/${banner.link}`)
                }
                className="w-full h-full overflow-hidden cursor-pointer hidden md:inline-block"
              >
                <Image
                  className="  w-full h-[500px] lg:h-[700px] aspect-video rounded-xl object-cover "
                  src={banner.image}
                  alt="Banner image"
                  width={1376}
                  height={700}
                  quality={70}
                  priority
                ></Image>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Banners;
