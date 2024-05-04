import { Product } from "@/types/Product";

export const RemoveDuplicate = (array: Product[]) => {
  const uniqueProducts = array.filter(
    (obj, index) => array.findIndex((item) => item.id === obj.id) === index
  );

  return uniqueProducts;
};

export const RemoveDuplicateSize = (array: string[]) => {
  const uniqueProducts = array.filter(
    (obj, index) => array.findIndex((item) => item === obj) === index
  );

  return uniqueProducts;
};
export const RemoveDuplicateColour = (
  array: { label: string; value: string }[]
) => {
  const uniqueProducts = array.filter(
    (obj, index) =>
      array.findIndex((item) => item.value === obj.value) === index
  );

  return uniqueProducts;
};
