import { AttributeValue } from "./AttributeValue";
import { Inventory } from "./Inventory";

export type AttributesOnInventory = {
  id: string;
  createdAt: Date;
  attributeValue: AttributeValue;
  attributeValueId: string;
  inventory: Inventory;
  inventoryId: string;
};
