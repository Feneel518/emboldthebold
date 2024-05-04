import { z } from "zod";

export const LoginValidator = z.object({
  email: z.string().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Password should contain minimum 8 letters",
  }),
});

export type LoginCreationRequest = z.infer<typeof LoginValidator>;
