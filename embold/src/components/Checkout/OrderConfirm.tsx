// "use client";

// import { CartItem, useCart } from "@/hooks/use-cart";
// import { FC, useEffect, useState } from "react";
// import { Card, CardContent, CardHeader } from "../ui/card";
// import Image from "next/image";
// import Link from "next/link";
// import Loading from "../Helpers/Loading";
// import { formatPrice } from "@/lib/utils";
// import { Label } from "../ui/label";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Address } from "@/types/Address";
// import EditorOutput from "../Frontend/EditorOutput";

// interface OrderConfirmProps {
//   items: CartItem[];
//   addressId: string;
// }

// export const dynamic = "force-dynamic";
// const OrderConfirm: FC<OrderConfirmProps> = ({ addressId, items }) => {
//   const [isMounted, setIsMounted] = useState(false);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const total = items.reduce((total, sum) => {
//     return (
//       total +
//       (sum.Inventory.discountedPrice
//         ? sum.Inventory.discountedPrice * sum.Quantity
//         : sum.Inventory.price * sum.Quantity)
//     );
//   }, 0);

//   const { data: address, isLoading } = useQuery({
//     queryKey: ["addressId"],
//     queryFn: async () => {
//       const { data } = await axios.get(
//         `/api/address/fetchById?addressId=${addressId}`
//       );

//       return data.address as Address;
//     },
//   });

//   return (
//     <>
//       {isMounted ? (
//         <Card className="bg-emboldLight50 mt-10 shadow-xl text-emboldBlack">
//           <CardContent>
//             <div className="flex flex-col gap-8">
//               <div className="border p-4 rounded-md flex justify-between w-full lg:flex-row flex-col max-lg:gap-8">
//                 <div className="w-full space-y-2">
//                   <Label className="font-semibold">Shipping Address</Label>
//                   <div className="">
//                     <p>
//                       {address?.firstName} {address?.lastName}
//                     </p>
//                     <p>{address?.addressLine1}</p>
//                     <p>{address?.addressLine2}</p>
//                     <p>
//                       {address?.city} {address?.state} {address?.pinCode}
//                     </p>
//                     <p>{address?.country}</p>
//                   </div>
//                 </div>
//                 <div className="w-96 space-y-2">
//                   <Label className="font-semibold ">Order Summary</Label>
//                   <div className="">
//                     <div className="grid grid-cols-2">
//                       <div className="">Item(s) Subtotal:</div>
//                       <div className="">{formatPrice(total)}</div>
//                     </div>
//                     <div className="grid grid-cols-2">
//                       <div className="">Shipping:</div>
//                       <div className="">{formatPrice(0)}</div>
//                     </div>
//                     <div className="grid grid-cols-2">
//                       <div className="">Total:</div>
//                       <div className="">{formatPrice(total)}</div>
//                     </div>
//                     <div className="grid grid-cols-2">
//                       <div className="font-semibold">Grand Total:</div>
//                       <div className="font-semibold">{formatPrice(total)}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="border p-4 rounded-md flex flex-col   w-full">
//                 {items.map((item) => {
//                   return (
//                     <div className="">
//                       <div className="flex lg:gap-20 lg:flex-row flex-col ">
//                         <div className="w-60 min-w-60 mx-auto">
//                           <Image
//                             className="w-full h-full"
//                             src={item.Inventory.Product.Image[0].url}
//                             alt={item.Inventory.Product.name}
//                             width={600}
//                             height={600}
//                           ></Image>
//                         </div>
//                         <div className="flex flex-col justify-between lg:w-[60%]  mt-4">
//                           <div className="">
//                             <Link
//                               href={`/product/${item.Inventory.Product.slug}`}
//                               className="lg:text-4xl text-2xl hover:underline hover:text-emboldBlack/80 transition-all duration-100 ease-out"
//                             >
//                               {item.Inventory.Product.name}
//                             </Link>
//                             <div className="line-clamp-4 mt-2">
//                               <EditorOutput
//                                 description={item.Inventory.Product.description}
//                               ></EditorOutput>
//                             </div>
//                           </div>
//                           <div className="">
//                             <div className="mt-4">
//                               {item.Inventory.AttributesOnInventory.map(
//                                 (attr, index) => (
//                                   <div className="grid grid-cols-2 w-64 text-xl gap-4">
//                                     <div className="">
//                                       {index === 0 ? "Colour:" : "Size:"}
//                                     </div>
//                                     <div className="">
//                                       {attr.attributeValue.name
//                                         ? attr.attributeValue.name
//                                         : attr.attributeValue.value}
//                                     </div>
//                                   </div>
//                                 )
//                               )}
//                             </div>
//                             <div className="grid grid-cols-2 w-64 text-xl gap-4">
//                               <div className="">Quantity:</div>
//                               <div className="">{item.Quantity}</div>
//                             </div>
//                             <div className="grid grid-cols-2 w-64 text-xl gap-4">
//                               <div className="">Price:</div>
//                               <div className="">
//                                 {item.Inventory.discountedPrice
//                                   ? formatPrice(item.Inventory.discountedPrice)
//                                   : formatPrice(item.Inventory.price)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="my-10 h-[1px] w-full bg-black/20 shadow-lg"></div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         //     <Card className="bg-emboldLight shadow-xl text-emboldBlack mt-10 ">
//         //       <CardContent>
//         //         <div className="">
//         //           <div className="flex flex-col gap-1 text-2xl">
//         //             <Label className="">Total</Label>
//         //             <div className="">{formatPrice(total)}</div>
//         //           </div>
//         //           <div className="flex flex-col gap-1 text-2xl">
//         //             <Label className="">Address</Label>
//         //             <div className="">
//         //               <div className="">{address?.addressLine1}</div>
//         //               <div className="">{address?.addressLine2}</div>
//         //               <div className="">
//         //                 {address?.city} {address?.state}
//         //               </div>
//         //               <div className="">{address?.country}</div>
//         //               <div className="">{address?.pinCode}</div>
//         //             </div>
//         //           </div>
//         //         </div>
//         //         <div className="h-[1px] bg-emboldBlack/20 w-full"></div>
//         //         <div className=" divide-embold/20 mt-8 flex flex-col gap-8">
//         //           {items.map((item) => {
//         //             return (
//         //               <div className="flex gap-10">
//         //                 <div className="w-32">
//         //                   <Image
//         //                     className="w-full h-full"
//         //                     src={item.Inventory.Product.Image[0].url}
//         //                     alt={item.Inventory.Product.name}
//         //                     width={400}
//         //                     height={400}
//         //                   ></Image>
//         //                 </div>
//         //                 <div className="w-full flex flex-col gap-4">
//         //                   <div className="lg:text-2xl">
//         //                     <Link
//         //                       href={`/product/${item.Inventory.Product.slug}`}
//         //                       className="hover:underline hover:underline-offset-2"
//         //                     >
//         //                       {item.Inventory.Product.name}
//         //                     </Link>
//         //                   </div>
//         //                   <div className="flex  gap-4 text-2xl">
//         //                     {item.Inventory.AttributesOnInventory.map((attr) => (
//         //                       <div className="">
//         //                         {attr.attributeValue.name
//         //                           ? attr.attributeValue.name
//         //                           : attr.attributeValue.value}
//         //                       </div>
//         //                     ))}
//         //                   </div>
//         //                   <div className="text-2xl">
//         //                     {item.Inventory.discountedPrice
//         //                       ? formatPrice(item.Inventory.discountedPrice)
//         //                       : formatPrice(item.Inventory.price)}
//         //                   </div>
//         //                 </div>
//         //               </div>
//         //             );
//         //           })}
//         //         </div>
//         //       </CardContent>
//         //     </Card>
//         <div className="w-full flex items-center justify-center mt-10">
//           <Loading></Loading>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderConfirm;
