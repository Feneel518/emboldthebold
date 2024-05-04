import { z } from "zod";

export const BannerValidator = z.object({
  image: z.string(),
  categoryId: z.string(),
  mobileImage: z.string().optional(),
});

export type BannerCreationRequest = z.infer<typeof BannerValidator>;
