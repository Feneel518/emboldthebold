import { z } from "zod";

export const CategoryValidator = z.object({
  id: z.string().optional(),
  name: z.string(),
  image: z.string().optional(),
  parentId: z.string(),
  showOnHome: z.boolean(),
  isActive: z.boolean(),
});

export type CategoryCreationRequest = z.infer<typeof CategoryValidator>;

export const CategoryDeleteValidator = z.object({
  id: z.string().optional(),
});

export type CategoryDeleteRequest = z.infer<typeof CategoryDeleteValidator>;
