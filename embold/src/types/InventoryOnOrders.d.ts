import { Inventory } from "./Inventory";
import { Orders } from "./Orders";

export type InventoryOnOrders = {
  id: string;
  createdAt: Date;
  inventory: Inventory;
  inventoryId: string;
  order: Orders;
  orderId: string;
  quantity: number;
  price: number;
};
