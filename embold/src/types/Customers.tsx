import { Address } from "./Address";
import { Orders } from "./Orders";
import { Wishlist } from "./Wishlist";

export type Customers = {
  Orders: Orders[];
  email: string;
  id: string;
  image: string | null;
  name: string;
  phoneNumber: string | null;
  username: string;
  Wishlist: Wishlist;
  Address: Address[] | null;
};
