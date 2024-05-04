import { Category } from "@/types/Category";

export async function getCategories() {
  const response = await fetch(
    `${process.env.HOST}/api/dashboard/categories/fetch`,
    {
      cache: "no-cache",
    }
  );
  const data = await response.json();
  return data.categories as Category[];
}
