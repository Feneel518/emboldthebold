import { z } from "zod";

export const ForgotValidator = z.object({
  email: z.string().min(1, {
    message: "Email is required",
  }),
});

export type ForgotCreationrequest = z.infer<typeof ForgotValidator>;
