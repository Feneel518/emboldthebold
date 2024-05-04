import { z } from "zod";

export const NewsLetterValidator = z.object({
  id: z.string().optional(),
  email: z.string().email(),
});

export type NewsLetterCreationRequest = z.infer<typeof NewsLetterValidator>;
