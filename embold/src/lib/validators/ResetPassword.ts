import { z } from "zod";

export const ResetValidator = z.object({
  password: z.string().min(8, {
    message: "Password must be a min of 8 characters.",
  }),
  confirmPassword: z.string(),
  token: z.string(),
});

export type ResetCreationRequest = z.infer<typeof ResetValidator>;
