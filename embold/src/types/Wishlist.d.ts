import { User } from "next-auth";
import { Product } from "./Product";
import { WishlistOnProducts } from "./WishlistOnProducts";

export type Wishlist = {
  id: string;
  userId: string;
  user: User;
  WishlistOnProducts: WishlistOnProducts[];
};
