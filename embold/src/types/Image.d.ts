import { Product } from "./Product";

export type Images = {
  id: string;
  url: string;
  altText: string;
  product?: Product;
  productId: string | null;
};
