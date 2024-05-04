// import { useCart } from "@/hooks/use-cart";
// import { Address } from "@prisma/client";
// import {
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { FC, useEffect, useState } from "react";
// import { toast } from "sonner";
// import { Label } from "../ui/label";
// import { formatPrice } from "@/lib/utils";
// import { Button } from "../ui/button";

// interface CheckoutFormProps {
//   clientSecret: string;
//   handleSetPaymentSuccess: (value: boolean) => void;
// }
// export const dynamic = "force-dynamic";

// const CheckoutForm: FC<CheckoutFormProps> = ({
//   clientSecret,
//   handleSetPaymentSuccess,
// }) => {
//   const { items, setPaymentIntent, clearCart, addressId } = useCart();

//   const { data: address, isLoading: isAddressLoading } = useQuery({
//     queryKey: ["addressId"],
//     queryFn: async () => {
//       const { data } = await axios.get(
//         `/api/address/fetchById?addressId=${addressId}`
//       );

//       return data.address as Address;
//     },
//   });

//   // const stripe = useStripe();
//   // const elements = useElements();
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const total = items.reduce((total, sum) => {
//     return (
//       total +
//       sum.Quantity *
//         (sum.Inventory.discountedPrice
//           ? sum.Inventory.discountedPrice
//           : sum.Inventory.price)
//     );
//   }, 0);

//   // useEffect(() => {
//   //   if (!stripe) return;
//   //   if (!clientSecret) return;
//   //   handleSetPaymentSuccess(false);
//   // }, [stripe]);

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   if (!stripe || !elements) return;

//   //   setIsLoading(true);

//   //   stripe
//   //     .confirmPayment({
//   //       elements,
//   //       redirect: "if_required",
//   //     })
//   //     .then((result) => {
//   //       if (!result.error) {
//   //         toast.success("Your payment was successfully paid.", {
//   //           className:
//   //             "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
//   //           style: {
//   //             backgroundColor: "#13505B",
//   //             color: "white",
//   //             fontSize: "16px",
//   //           },
//   //         });
//   //         handleSetPaymentSuccess(true);
//   //         clearCart();
//   //       }
//   //       setIsLoading(false);
//   //     });
//   // };
//   return (
//     <div className="">
//       <h1 className="text-xl mb-4">Enter the details to complete checkout.</h1>
//       <form
//         action=""
//         // onSubmit={handleSubmit}
//         id="payment-form"
//         className="flex  flex-col gap-8 border lg:p-8 p-4 rounded-lg shadow-lg bg-emboldLight50"
//       >
//         <div className="w-full flex justify-between">
//           <div className="">
//             <Label className="font-semibold text-xl">Shipping Address</Label>
//             <div className="">
//               <p>
//                 {address?.firstName} {address?.lastName}
//               </p>
//               <p>{address?.addressLine1}</p>
//               <p>{address?.addressLine2}</p>
//               <p>
//                 {address?.city} {address?.state} {address?.pinCode}
//               </p>
//               <p>{address?.country}</p>
//             </div>
//           </div>
//           <h2 className="font-semibold text-3xl">
//             Amount: {formatPrice(total)}
//           </h2>
//         </div>

//         <div className="flex flex-col gap-4">
//           <h1 className="text-xl">Payment Information</h1>
//           <PaymentElement
//             options={{
//               paymentMethodOrder: ["google_pay", "card"],
//             }}
//           ></PaymentElement>
//         </div>
//         <div className="">
//           {/* <Button disabled={!stripe || !elements} className="w-full">
//             Pay now.
//           </Button> */}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CheckoutForm;
