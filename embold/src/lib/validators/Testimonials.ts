import { z } from "zod";

export const TestimonialValidator = z.object({
  id: z.string().optional(),
  name: z.string(),
  comment: z.string(),
  image: z.string(),
});

export type TestimonialCreationRequest = z.infer<typeof TestimonialValidator>;

export const TestimonialDeleteValidator = z.object({
  id: z.string(),
});

export type TestimonialDeleteRequest = z.infer<
  typeof TestimonialDeleteValidator
>;
