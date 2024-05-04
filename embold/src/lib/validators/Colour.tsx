import { z } from "zod";

export const ColourValidator = z.object({
  id: z.string().optional(),
  label: z.string(),
  value: z.string(),
});

export type ColourCreationRequest = z.infer<typeof ColourValidator>;
