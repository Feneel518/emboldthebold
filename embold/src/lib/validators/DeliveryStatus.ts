import { z } from "zod";

export const DeliveryStatusValidator = z.object({
  orderId: z.string().optional(),
  status: z.string(),
  courierName: z.string(),
  courierDocketId: z.string(),
});

export type DeliveryStatusCreationRequest = z.infer<
  typeof DeliveryStatusValidator
>;
