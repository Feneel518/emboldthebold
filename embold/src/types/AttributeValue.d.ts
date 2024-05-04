import { AttributesOnInventory } from "./AttriburtesOnInventory";

export type AttributeValue = {
  id: string;
  value: string;
  name?: string;
  attribute: AttributeValue;
  attributeId: string;
  AttributesOnInventory: AttributesOnInventory[];
};
