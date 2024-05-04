import { z } from "zod";

export const OrderValidator = z.object({
  cartItem: z
    .object({
      price: z.number().min(1),
      quantity: z.number().min(1),
      inventoryId: z.string(),
    })
    .array(),
  isOnline: z.boolean(),
  paid: z.boolean(),
  userEmail: z.string().email(),
  userName: z.string().min(3, {
    message: "Min 3 characters are required.",
  }),
  userPhone: z.string().min(10),
  status: z.string().optional(),
});

export type OrderCreationRequest = z.infer<typeof OrderValidator>;
