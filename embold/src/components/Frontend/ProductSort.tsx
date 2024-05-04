"use client";

import { Product } from "@/types/Product";
import { FC, useState } from "react";
import Select from "react-select";

interface ProductSortProps {
  products: Product[];
}

const ProductSort: FC<ProductSortProps> = ({ products }) => {
  products.sort((a, b) => (a.name > b.name ? 1 : -1));
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

  return (
    <div className="text-right flex items-center justify-end gap-4 px-20 -mt-12">
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
  );
};

export default ProductSort;
