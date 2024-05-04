import { Category } from "./Category";
import { Product } from "./Product";

export type CategoriesOnProducts = {
  id: string;
  product: Product;
  productId: string;
  category: Category;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};
