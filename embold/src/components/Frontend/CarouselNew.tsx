"use client";

import React, { useEffect, useState, FC } from "react";
import CarouselItem from "./CarouselItem";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

interface CarouselNewProps {}
const CarouselNew: FC<CarouselNewProps> = ({}) => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await axios.get("/api/testimonials/fetch");
      return data.testimonials as {
        id: string;
        name: string;
        comment: string;
        image: string;
      }[];
    },
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);

  // ////////////////////////////////////////////////////////
  const [touchPosition, setTouchPosition] = useState(null);

  // ////////////////////////////////////////////////////////
  const handleTouchStart = (e: any) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e: any) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      handlePrevious();
    }

    if (diff < -5) {
      handleNext();
    }

    setTouchPosition(null);
  };

  // //////////////////////////////////////////////////////////////////
  if (!testimonials) return null;

  const handleNext = () => {
    setActiveIndex((prev) => {
      return prev + 1 < testimonials.length ? prev + 1 : prev;
    });
  };
  const handlePrevious = () => {
    setActiveIndex((prev) => {
      return prev - 1 >= 0 ? prev - 1 : prev;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center my-10">
        <Skeleton className="h-[400px] w-[500px] bg-emboldLight50/50"></Skeleton>
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <div className="">
      <div className="mb-8 flex flex-col  ">
        <h1 className=" text-3xl font-bold max-lg:text-center">{`Hear it from the Embold Fam !`}</h1>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mx-40 flex items-center justify-center max-sm:mx-4 w-full"
      >
        <div className="carousel-container relative flex h-[500px] w-full items-center justify-center rounded-lg text-black  duration-300  ease-in-out transition-all max-lg:w-[500px]">
          {activeIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="carousel-btn-switch-card-left carousel-btn-switch-card"
            >
              <ArrowLeft />
            </button>
          )}
          {testimonials.map((testi, index) => (
            <CarouselItem
              key={testi.id}
              index={index}
              activeIndex={activeIndex}
            >
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                key={testi.id}
                className="relative flex h-full flex-col  items-center justify-center gap-4 px-4 py-4"
              >
                <div className="absolute right-40  top-16  max-sm:right-10">
                  <Quote className="h-40 w-40 opacity-10 max-sm:h-20  max-sm:w-20" />
                </div>
                <div className="flex items-center justify-center gap-4 lg:gap-20  px-1 ">
                  <div className="aspect-square w-64 max-lg:w-40 max-md:hidden">
                    <Image
                      src={testi.image}
                      alt={testi.name}
                      width={400}
                      height={400}
                    ></Image>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 text-xs ">
                    <p className="  w-[600px] p-2 text-justify text-lg italic max-lg:w-[300px] max-md:text-sm">
                      " {testi.comment} "
                    </p>{" "}
                    <div className="h-0.5 w-4 bg-black"></div>
                    {testi.name}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}

          {activeIndex < testimonials.length - 1 && (
            <button
              onClick={handleNext}
              className="carousel-btn-switch-card carousel-btn-switch-card-right"
            >
              <ArrowRight />
            </button>
          )}
        </div>

        {/* /////////////////////////////////////// */}
      </motion.div>
    </div>
  );
};

export default CarouselNew;
