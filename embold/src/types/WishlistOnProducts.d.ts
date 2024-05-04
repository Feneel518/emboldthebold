import { User } from "next-auth";
import { Product } from "./Product";
import { WishlistOnProducts } from "@prisma/client";

export type WishlistOnProducts = {
  id: string;
  wishlistId: string;
  Wishlist: Wishlist;
  productId: string;
  Product: Product;
};
