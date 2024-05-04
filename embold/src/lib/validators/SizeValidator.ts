import { z } from "zod";

export const SizeValidator = z.object({
  size: z.string(),
});

export type SizeCreationRequest = z.infer<typeof SizeValidator>;
