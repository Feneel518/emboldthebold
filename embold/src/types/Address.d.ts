import { User } from "next-auth";
import { Orders } from "./Orders";

export type Address = {
  id: string;
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  phoneNumber: string;
  isDefault: boolean;
  user: User;
  userId: string;
  Orders: Orders[];
};
