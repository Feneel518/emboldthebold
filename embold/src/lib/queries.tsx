import { Product } from "@/types/Product";

export async function getProducts() {
  const response = await fetch(
    `${process.env.HOST}/api/dashboard/product/fetch?take=${process.env.INFINTE_SCROLLING_PAGINATION_RESULTS}`,
    {
      cache: "no-cache",
    }
  );

  const data = await response.json();

  return data.product as Product[];
}

export async function getAllProducts() {
  const response = await fetch(
    `${process.env.HOST}/api/dashboard/product/fetchAll`,
    {
      cache: "no-cache",
    }
  );

  const data = await response.json();

  // return data.product as Product[];
}
