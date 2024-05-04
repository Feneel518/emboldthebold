import { Inventory } from "./Inventory";

export type Quantity = {
  id?: string;
  quantity: number;
  inventory: Inventory;
  inventoryId: string;
};
