import { z } from "zod";

export const RegisterValidator = z.object({
  name: z.string().min(3, {
    message: "Name is requred.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number is required.",
  }),
  email: z.string().min(1, {
    message: "Email is required.",
  }),
  password: z.string().min(8, {
    message: "Password is required.",
  }),
});

export type RegisterCreationRequest = z.infer<typeof RegisterValidator>;
