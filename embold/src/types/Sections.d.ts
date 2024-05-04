import { Category } from "./Category";

export type Sections = {
  id?: string;
  isActive: boolean;
  category: Category;
  categoryId: string;
};
