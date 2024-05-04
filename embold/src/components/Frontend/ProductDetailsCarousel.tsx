"use client";

import { Images } from "@/types/Image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { motion } from "framer-motion";
import CarouselItem from "./CarouselItem";

interface ProductDetailsCarouselProps {
  images: Images[];
  name: string;
}

const ProductDetailsCarousel: FC<ProductDetailsCarouselProps> = ({
  images,
}) => {
  const [activeImg, setActiveImg] = useState(0);

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
      handleNext();
    }

    if (diff < -5) {
      handlePrevious();
    }

    setTouchPosition(null);
  };

  const handleNext = () => {
    setActiveImg((prev) => {
      return prev + 1 < images.length ? prev + 1 : prev;
    });
  };
  const handlePrevious = () => {
    setActiveImg((prev) => {
      return prev - 1 >= 0 ? prev - 1 : prev;
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className=" flex flex-col gap-6 items-center justify-center max-sm:mx-4 w-fit "
    >
      {/* <h1 className="lg:hidden text-center text-3xl">{name}</h1> */}
      <div className="carousel-container relative flex min-h-[700px]  w-full lg:min-w-[400px] items-center justify-center rounded-lg text-black  duration-300  ease-in-out transition-all max-lg:w-[300px]">
        {activeImg > 0 && (
          <button
            onClick={handlePrevious}
            className="product-btn-switch-card-left carousel-btn-switch-card "
          >
            <ArrowLeft />
          </button>
        )}
        {images.map((testi, index) => (
          <CarouselItem key={testi.id} index={index} activeIndex={activeImg}>
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              key={testi.id}
              className="relative flex w-full h-full flex-col items-center  justify-center gap-4 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]"
            >
              <Image
                src={testi.url}
                alt={testi.altText}
                width={400}
                height={600}
                priority
                quality={75}
              ></Image>
            </div>
          </CarouselItem>
        ))}

        {activeImg < images.length - 1 && (
          <button
            onClick={handleNext}
            className="carousel-btn-switch-card product-btn-switch-card-right"
          >
            <ArrowRight />
          </button>
        )}
      </div>
      <div className="flex flex-row gap-4 h-32  flex-wrap">
        {images.map((image, index) => {
          return (
            <Image
              key={image.id}
              onMouseEnter={() => setActiveImg(index)}
              src={image.url}
              alt={image.altText}
              width={96}
              height={96}
              className="w-24 h-24 rounded-md cursor-pointer object-cover object-top"
            ></Image>
          );
        })}
      </div>
      {/* /////////////////////////////////////// */}
    </motion.div>
  );
};

export default ProductDetailsCarousel;
