import { Wishlist, WishlistOnProducts } from "@prisma/client";
import { CategoriesOnProducts } from "./CategoriesOnProducts";
import { ColourOnProducts } from "./ColourOnProducts";
import { Image, Images } from "./Image";
import { Inventory } from "./Inventory";
import { SizeOnProducts } from "./SizeOnProducts";

export type Product = {
  id: string;
  name: string;
  description?: any;
  slug: string;
  isActive: boolean;
  showOnHome: boolean;
  createdAt: Date;
  updatedAt: Date;
  colour: {
    label: string;
    value: string;
  }[];
  size: [string];

  categoriesOnProducts?: CategoriesOnProducts[];

  Image: Images[];

  Inventory: Inventory[];

  WishlistOnProducts: WishlistOnProducts[];
};
