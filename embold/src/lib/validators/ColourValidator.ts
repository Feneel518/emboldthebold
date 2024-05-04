import { z } from "zod";

export const ColourValidator = z.object({
  colourName: z.string(),
  colourValue: z.string(),
});

export type ColourCreationRequest = z.infer<typeof ColourValidator>;
