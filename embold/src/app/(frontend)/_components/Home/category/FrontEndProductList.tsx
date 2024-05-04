"use client";

import ProductCard from "@/components/Frontend/ProductCard";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { Product } from "@/types/Product";
import { FC, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Filter from "@/components/Frontend/Filter";
import {
  RemoveDuplicateColour,
  RemoveDuplicateSize,
} from "@/components/Utilities/RemoveDuplicates";
import { motion } from "framer-motion";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface FrontEndProductListProps {
  products: Product[];
}

const FrontEndProductList: FC<FrontEndProductListProps> = ({ products }) => {
  const [sort, setSort] = useState<string>();

  const handleSort = (data: { label: string; value: string }) => {
    setSort(data.value);
  };

  if (sort === "priceAsc") {
    products.sort((a, b) =>
      a.Inventory[0].discountedPrice !== 0
        ? a.Inventory[0].discountedPrice >
          (b.Inventory[0].discountedPrice !== 0
            ? b.Inventory[0].discountedPrice
            : b.Inventory[0].price)
          ? 1
          : -1
        : a.Inventory[0].price >
          (b.Inventory[0].discountedPrice !== 0
            ? b.Inventory[0].discountedPrice
            : b.Inventory[0].price)
        ? 1
        : -1
    );
  } else if (sort === "priceDesc") {
    products.sort((a, b) =>
      a.Inventory[0].discountedPrice !== 0
        ? a.Inventory[0].discountedPrice >
          (b.Inventory[0].discountedPrice !== 0
            ? b.Inventory[0].discountedPrice
            : b.Inventory[0].price)
          ? -1
          : 1
        : a.Inventory[0].price >
          (b.Inventory[0].discountedPrice !== 0
            ? b.Inventory[0].discountedPrice
            : b.Inventory[0].price)
        ? -1
        : 1
    );
  } else if (sort === "createdAtDesc") {
    products.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }

  const colours = RemoveDuplicateColour(
    products.flatMap((prod) => {
      return prod.colour;
    })
  );

  const size = RemoveDuplicateSize(
    products.flatMap((prod) => {
      return prod.size;
    })
  );

  const [filteredSize, setFilteredSize] = useState<string>();
  const [filteredColour, setFilteredColour] = useState<{
    label: string;
    value: string;
  }>();
  const [filteredPrice, setFilteredPrice] = useState<string>();

  const values = (
    colour: { label: string; value: string },
    size: string,
    price: string
  ) => {
    useMemo(() => {
      setFilteredColour(colour);
      setFilteredSize(size);
      setFilteredPrice(price);
    }, [colour, size, price]);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  let filteredProducts: Product[] = products;

  if (filteredColour) {
    filteredProducts = products.filter((prod) =>
      prod.colour.includes(filteredColour)
    );
  }

  if (filteredSize) {
    filteredProducts = filteredProducts.filter((prod) =>
      prod.size.includes(filteredSize)
    );
  }

  if (filteredPrice === "< ₹499") {
    filteredProducts = filteredProducts.filter((prod) =>
      prod.Inventory[0].discountedPrice
        ? prod.Inventory[0].discountedPrice < 499
        : prod.Inventory[0].price < 499
    );
  }
  if (filteredPrice === "₹500 - ₹999 ") {
    filteredProducts = filteredProducts.filter((prod) =>
      prod.Inventory[0].discountedPrice
        ? prod.Inventory[0].discountedPrice > 499 &&
          prod.Inventory[0].discountedPrice < 999
        : prod.Inventory[0].price > 499 && prod.Inventory[0].price < 999
    );
  }
  if (filteredPrice === "₹1000 - ₹1999 ") {
    filteredProducts = filteredProducts.filter((prod) =>
      prod.Inventory[0].discountedPrice
        ? prod.Inventory[0].discountedPrice > 999 &&
          prod.Inventory[0].discountedPrice < 1999
        : prod.Inventory[0].price > 999 && prod.Inventory[0].price < 1999
    );
  }
  if (filteredPrice === "₹2000 + ") {
    filteredProducts = filteredProducts.filter((prod) =>
      prod.Inventory[0].discountedPrice
        ? prod.Inventory[0].discountedPrice > 1999
        : prod.Inventory[0].price > 1999
    );
  }
  if (!isMounted) return null;

  return (
    <MaxWidthWrapper>
      <div className=" max-lg:hidden text-right flex items-center justify-end gap-4 px-20 -mt-12">
        <h5>Sort</h5>
        <Select
          className="text-emboldBlack w-40 text-left"
          defaultValue={{ label: "Newest Arrivals", value: "createdAtDesc" }}
          id="parentCategory"
          styles={{
            control: (base, state) => ({
              ...base,
              border: "1px solid #040404",

              minHeight: "2.5rem",
              boxShadow: state.isFocused ? "0" : "0",
              // background: "#1F1F1F",
              "&:hover": {
                border: "1px solid #040404)",
              },
              color: "#040404",
            }),
            menu: (base, state) => ({
              ...base,
              // backgroundColor: "#13505B",
              borderRadius: "10px",
            }),
            option: (provided, state) => ({
              ...provided,
              color: state.isFocused ? "white" : "#13505B",
              backgroundColor: state.isFocused ? "#13505B" : "white",
              cursor: "pointer",
            }),
            singleValue: (provided, state) => ({
              ...provided,
              color: "#000",
            }),
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: "#CDEAEC",
            },
          })}
          options={[
            { label: "Price: Low to High", value: "priceAsc" },
            { label: "Price: High to Low", value: "priceDesc" },
            { label: "Newest Arrivals", value: "createdAtDesc" },
          ]}
          // @ts-ignore
          onChange={handleSort}
        ></Select>
      </div>
      <div className="flex flex-col lg:flex-row gap-2 ">
        <div className="flex  justify-between px-4">
          <Filter colours={colours} size={size} values={values}></Filter>

          <Drawer>
            <DrawerTrigger className="lg:hidden">Sort</DrawerTrigger>
            <DrawerContent className="bg-emboldLight50 flex items-center justify-center pb-20 ">
              <div className=" lg:hidden text-right flex items-center mt-8 gap-4">
                <h5>Sort</h5>
                <Select
                  className="text-emboldBlack w-40 text-left"
                  defaultValue={{
                    label: "Newest Arrivals",
                    value: "createdAtDesc",
                  }}
                  id="parentCategory"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      border: "none",
                      minHeight: "2.5rem",
                      boxShadow: state.isFocused ? "0" : "0",
                      // background: "#1F1F1F",
                      "&:hover": {
                        border: "1px solid #040404)",
                      },
                      color: "#040404",
                    }),
                    menu: (base, state) => ({
                      ...base,
                      // backgroundColor: "#13505B",
                      borderRadius: "10px",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      color: state.isFocused ? "white" : "#13505B",
                      backgroundColor: state.isFocused ? "#13505B" : "white",
                      cursor: "pointer",
                    }),
                    singleValue: (provided, state) => ({
                      ...provided,
                      color: "#000",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#CDEAEC",
                    },
                  })}
                  options={[
                    { label: "Price: Low to High", value: "priceAsc" },
                    { label: "Price: High to Low", value: "priceDesc" },
                    { label: "Newest Arrivals", value: "createdAtDesc" },
                  ]}
                  // @ts-ignore
                  onChange={handleSort}
                ></Select>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <Separator className="my-1 lg:hidden "></Separator>
        {filteredProducts.length === 0 && (
          <div className="w-full">
            <div className="flex justify-center mt-20 text-xl ">
              No results found.
            </div>
          </div>
        )}
        <motion.div
          layout
          className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:mt-8 mt-2"
        >
          {filteredProducts.map((prod, index) => {
            return <ProductCard key={prod.id} product={prod}></ProductCard>;
          })}
        </motion.div>
      </div>
    </MaxWidthWrapper>
  );
};

export default FrontEndProductList;
