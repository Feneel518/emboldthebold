export type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string | undefined;
  isActive: boolean;
  showOnHome: boolean;
  createdAt: Date;
  updatedAt: Date;
  parent?: Category;
  parentId?: string;
  subCategory?: Category[];
  order?: number;
};
