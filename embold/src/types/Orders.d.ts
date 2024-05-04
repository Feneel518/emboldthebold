import { CartItem } from "@/hooks/use-cart";
import { Status } from "@prisma/client";
import { User } from "next-auth";
import { Address } from "./Address";
import { InventoryOnOrders } from "./InventoryOnOrders";

export type Orders = {
  id?: string;
  createdAt?: Date;
  email: string;
  orderItem: CartItem[];
  isOnline: boolean;
  paid: boolean;
  userName?: string;
  userPhone?: string;
  amount: number;
  paymentIntentId: string;
  user?: User;
  userId: string;
  status: Status;
  Address?: Address;
  addressId?: string;
  InventoryOnOrders: InventoryOnOrders[];
};
