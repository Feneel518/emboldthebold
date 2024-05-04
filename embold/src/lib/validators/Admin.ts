import { z } from "zod";

export const AdminValidator = z.object({
  id: z.string().optional(),
  email: z.string(),
});

export type AdminCreationRequest = z.infer<typeof AdminValidator>;
