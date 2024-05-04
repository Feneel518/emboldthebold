import { Colour } from "./Colour";
import { Product } from "./Product";
import { Size } from "./Size";

export type ColourOnProducts = {
  id?: string;
  colour: Colour;
  colourId: string;
  product: Product;
  productId: string;
};
