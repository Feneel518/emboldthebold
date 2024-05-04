import { z } from "zod";

export const ProductValidator = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.any(),
  images: z.string().array(),
  categoryIds: z.string().array(),
  showOnHome: z.boolean(),
  isActive: z.boolean(),
  sizeValues: z.string().array().optional(),
  colourValues: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array()
    .optional(),
  inventory: z
    .object({
      price: z.number(),
      discountedPrice: z.number().optional().nullable(),
      quantity: z.number(),
      subProductName: z.string(),
      Sku: z.string(),
    })
    .array(),
});

export type ProductCreationRequest = z.infer<typeof ProductValidator>;

export const ProductDeleteValidator = z.object({
  id: z.string().optional(),
});

export type ProductDeleteRequest = z.infer<typeof ProductDeleteValidator>;
