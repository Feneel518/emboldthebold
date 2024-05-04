import { Product } from "./Product";
import { Size } from "./Size";

export type SizeOnProducts = {
  id?: string;
  size: Size;
  sizeId: string;
  product: Product;
  productId: string;
};
