import { z } from "zod";

export const SectionValidator = z.object({
  firstSection: z.string().optional(),
  secondSection: z.string().optional(),
  thirdSection: z.string().optional(),
  fourthSection: z.string().optional(),
  fifthSection: z.string().optional(),
  firstActive: z.boolean(),
  secondActive: z.boolean(),
  thirdActive: z.boolean(),
  fourthActive: z.boolean(),
  fifthActive: z.boolean(),
});

export type SectionCreationRequest = z.infer<typeof SectionValidator>;
