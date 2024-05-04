import { AttributesOnInventory } from "./AttriburtesOnInventory";
import { Colour } from "./Colour";
import { Product } from "./Product";
import { Quantity } from "./Quantity";
import { Size } from "./Size";

export type Inventory = {
  id?: string;
  price: number;
  discountedPrice: number;
  Product: Product;
  productId: string;
  Quantity: Quantity;
  createdAt: Date;
  updatedAt: Date;
  Sku: string;
  AttributesOnInventory: AttributesOnInventory[];
};
