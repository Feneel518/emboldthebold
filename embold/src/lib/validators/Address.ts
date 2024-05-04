import { z } from "zod";

export const AddressValidator = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  country: z.string(),
  firstName: z.string().min(3, {
    message: "First Name is required",
  }),
  lastName: z.string().min(3, {
    message: "Last Name is required",
  }),
  addressLine1: z.string().min(3, {
    message: "Address Line 1 is required",
  }),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  pinCode: z.string().min(3, {
    message: "Pincode is required",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone Number is required",
  }),
  isDefault: z.boolean().default(false),
  userid: z.string().optional(),
});

export type AddressCreationRequest = z.infer<typeof AddressValidator>;
