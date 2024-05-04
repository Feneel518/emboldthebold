"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { sortArrayOfGradings } from "@/lib/data/ColourData";

interface FilterProps {
  colours: { label: string; value: string }[];
  size: string[];
  values: (
    colour: { label: string; value: string },
    size: string,
    price: string
  ) => void;
}

const Filter: FC<FilterProps> = ({ colours, size, values }) => {
  colours.sort((a, b) => (a.value > b.value ? -1 : 1));
  const sizeDec = sortArrayOfGradings(size);

  const [selectedColour, setSelectedColour] = useState<{
    label: string;
    value: string;
  } | null>();

  const [selectedSize, setSelectedSize] = useState<string>("");

  const [selectedFilter, setSelectedFilter] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>("");

  // @ts-ignore
  const handleSelectedSizeFilter = (e) => {
    if (selectedSize === e.target.textContent) {
      return setSelectedSize("");
    }
    setSelectedSize(e.target.textContent);
  };
  // @ts-ignore
  const handleSelectedColourFilter = (e) => {
    if (selectedColour?.value === e.value) {
      return setSelectedColour(null);
    }
    setSelectedColour(e);
  };
  // @ts-ignore
  const handleSelectedPriceFilter = (e) => {
    if (selectedPriceFilter === e.target.textContent) {
      return setSelectedPriceFilter("");
    }
    setSelectedPriceFilter(e.target.textContent);
  };

  values(selectedColour!, selectedSize, selectedPriceFilter);

  const clearFilter = () => {
    setSelectedColour(null), setSelectedSize("");
    setSelectedPriceFilter("");
  };

  return (
    <div className="">
      <div className="max-lg:hidden  -ml-10 p-8 mt-8 w-64 bg-emboldLight50 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="">Filter by:</h2>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="cursor-pointer text-emboldBlack"
            onClick={clearFilter}
          >
            X
          </Button>
        </div>
        <div className="">
          <h3 className="text-lg font-semibold ">Colours</h3>
          <Separator></Separator>
          <div className="mt-2 flex gap-2 flex-wrap">
            {colours.map((col, index) => {
              const colo = col.value;
              return (
                <div
                  key={index}
                  className={`${
                    selectedColour?.value === col.value ? "border " : ""
                  }  flex h-10 w-10 items-center justify-center rounded-full cursor-pointer  border-black duration-75 ease-in-out transition-all hover:scale-110 hover:border`}
                  onClick={() => {
                    handleSelectedColourFilter(col);
                  }}
                  style={{ backgroundColor: colo }}
                ></div>
              );
            })}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold ">Size</h3>
          <Separator></Separator>
          <div className="mt-2 flex gap-2 flex-wrap">
            {sizeDec.map((siz, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    selectedSize === siz ? "bg-embold text-white " : ""
                  }  flex h-10 w-10 items-center justify-center rounded-full cursor-pointer  border-black duration-75 ease-in-out transition-all hover:scale-110 hover:border`}
                  onClick={(e) => handleSelectedSizeFilter(e)}
                >
                  {siz}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold ">Price</h3>
          <Separator></Separator>
          <div className="grid ">
            <div className="mt-2 flex flex-col gap-2">
              <div
                onClick={(e) => handleSelectedPriceFilter(e)}
                className={`cursor-pointer rounded-sm p-1 pl-1 hover:bg-embold hover:text-emboldLight ${
                  selectedPriceFilter.includes("< ₹499")
                    ? "bg-embold text-emboldLight shadow-md"
                    : ""
                }`}
              >
                {"<"} ₹499
              </div>
              <div
                onClick={(e) => handleSelectedPriceFilter(e)}
                className={`cursor-pointer rounded-sm p-1 pl-1 hover:bg-embold hover:text-emboldLight ${
                  selectedPriceFilter.includes("₹500 - ₹999 ")
                    ? "bg-embold text-emboldLight shadow-md"
                    : ""
                }`}
              >
                ₹500 - ₹999{" "}
              </div>
              <div
                onClick={(e) => handleSelectedPriceFilter(e)}
                className={`cursor-pointer rounded-sm p-1 pl-1 hover:bg-embold hover:text-emboldLight ${
                  selectedPriceFilter.includes("₹1000 - ₹1999 ")
                    ? "bg-embold text-emboldLight shadow-md"
                    : ""
                }`}
              >
                ₹1000 - ₹1999{" "}
              </div>
              <div
                onClick={(e) => handleSelectedPriceFilter(e)}
                className={`cursor-pointer rounded-sm p-1 pl-1 hover:bg-embold hover:text-emboldLight ${
                  selectedPriceFilter.includes("₹2000 + ")
                    ? "bg-embold text-emboldLight shadow-md"
                    : ""
                }`}
              >
                ₹2000 +{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <Drawer>
          <DrawerTrigger>Filter</DrawerTrigger>
          <DrawerContent className="bg-emboldLight50 flex items-center justify-center">
            <div className=" mt-8 w-64 ">
              <div className="flex justify-between items-center mb-4">
                <h2 className="">Filter by:</h2>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer text-emboldBlack"
                  onClick={clearFilter}
                >
                  X
                </Button>
              </div>
              <div className="">
                <h3 className="text-lg font-semibold ">Colours</h3>
                <Separator></Separator>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {colours.map((col, index) => {
                    const colo = col.value;
                    return (
                      <div
                        key={index}
                        className={`${
                          selectedColour?.value === col.value ? "border " : ""
                        }  flex h-10 w-10 items-center justify-center rounded-full cursor-pointer  border-black duration-75 ease-in-out transition-all hover:scale-110 hover:border`}
                        onClick={() => {
                          handleSelectedColourFilter(col);
                        }}
                        style={{ backgroundColor: colo }}
                      ></div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold ">Size</h3>
                <Separator></Separator>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {size.map((siz, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          selectedSize === siz ? "bg-embold text-white " : ""
                        }  flex h-10 w-10 items-center justify-center rounded-full cursor-pointer  border-black duration-75 ease-in-out transition-all hover:scale-110 hover:border`}
                        onClick={(e) => handleSelectedSizeFilter(e)}
                      >
                        {siz}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold ">Price</h3>
                <Separator></Separator>
                <div className="grid ">
                  <div className="mt-2 flex flex-col gap-2">
                    <div
                      onClick={(e) => handleSelectedPriceFilter(e)}
                      className={`cursor-pointer rounded-sm p-1 pl-1 hover:bg-embold hover:text-emboldLight ${
                        selectedPriceFilter.includes("< ₹499")
                          ? "bg-embold text-emboldLight shadow-md"
                          : ""
                      }`}
                    >
                      {"<"} ₹499
                    </div>
                    <div
                      onClick={(e) => handleSelectedPriceFilter(e)}
                      className={`cursor-pointer rounded-sm p-1 pl-1 hover:bg-embold hover:text-emboldLight ${
                        selectedPriceFilter.includes("₹500 - ₹999 ")
                          ? "bg-embold text-emboldLight shadow-md"
                          : ""
                      }`}
                    >
                      ₹500 - ₹999{" "}
                    </div>
                    <div
                      onClick={(e) => handleSelectedPriceFilter(e)}
                      className={`cursor-pointer rounded-sm p-1 pl-1 hover:bg-embold hover:text-emboldLight ${
                        selectedPriceFilter.includes("₹1000 - ₹1999 ")
                          ? "bg-embold text-emboldLight shadow-md"
                          : ""
                      }`}
                    >
                      ₹1000 - ₹1999{" "}
                    </div>
                    <div
                      onClick={(e) => handleSelectedPriceFilter(e)}
                      className={`cursor-pointer rounded-sm p-1 pl-1 hover:bg-embold hover:text-emboldLight ${
                        selectedPriceFilter.includes("₹2000 + ")
                          ? "bg-embold text-emboldLight shadow-md"
                          : ""
                      }`}
                    >
                      ₹2000 +{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Filter;
