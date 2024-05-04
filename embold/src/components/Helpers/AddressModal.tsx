"use client";

import { FC, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Address } from "@/types/Address";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "../ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { PlusCircleIcon } from "lucide-react";

interface AddressModalProps {}

const AddressModal: FC<AddressModalProps> = () => {
  const router = useRouter();
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const { data: Session } = useSession();

  if (!Session?.user) return null;

  const { data: address, isLoading: addressLoading } = useQuery({
    queryKey: ["Address"],
    queryFn: async () => {
      const { data } = await axios.get("/api/address/fetch");

      return data.address as Address[];
    },
  });

  const { setAddressId } = useCart();

  const [selectedAddress, setSelectedAddress] = useState<
    string | null | undefined
  >(address ? address.find((el) => el.isDefault === true)?.id : null);

  const { items, paymentIntent, setPaymentIntent, addressId, clearCart } =
    useCart();

  useEffect(() => {
    if (address)
      setSelectedAddress(address.find((el) => el.isDefault === true)?.id);
  }, [address]);

  const handleCheckOut = async () => {
    setIsLoading(true);
    if (selectedAddress) {
      const addre = address!.filter((ad) => ad.id === selectedAddress);
      setAddressId(selectedAddress);
      const cartItem = items.map((item) => {
        return {
          inventoryId: item.Inventory.id,
          price: item.Inventory.discountedPrice
            ? item.Inventory.discountedPrice
            : item.Inventory.price,
          quantity: item.Quantity,
        };
      });
      const payload = {
        paymentIntentId: paymentIntent,
        addressId: addre[0].id,
        cartItem: cartItem,
      };
      const data = await axios.post("/api/razorpay-checkout", payload);

      setPaymentIntent(data.data.paymentIntent.id);
      const options = {
        key: process.env.RAZORPAY_API_KEY, // Enter the Key ID generated from the Dashboard
        amount: data.data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Embold",
        description: "Tax Invoice",
        image:
          "https://embold.s3.ap-south-1.amazonaws.com/uploads/blacklogo.png",
        order_id: data.data.paymentIntent.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response: any) {
          try {
            const payload: any = {
              response,
              orderId: data.data.order.id,
              cartItem: cartItem,
            };
            const orderData = await axios.post(
              "/api/razorpay-checkout/paymentverification",
              payload
            );

            if (orderData.status === 200) {
              clearCart();
              router.push("/thank-you");
            }
            return orderData;
          } catch (error) {
            console.log(error);
          }
        },
        prefill: {
          name: `${addre[0].firstName} ${addre[0].lastName}`,
          email: addre[0].email,
          contact: addre[0].phoneNumber,
        },
        notes: {
          addressLine1: addre[0].addressLine1,
          addressLine2: addre[0].addressLine2,
          city: addre[0].city,
          state: addre[0].state,
        },
        theme: {
          color: "#13505B",
        },
      };
      setIsLoading(false);
      setOpen(false);
      // @ts-ignore
      const razor = new window.Razorpay(options);
      razor.open();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className={"w-full"}>Checkout</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-emboldBlack">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center  justify-between">
            <div className="w-full">Select a delivery address</div>
            <Button
              className="w-fit text-lg whitespace-nowrap  flex items-center gap-2 "
              variant={"ghosting"}
              onClick={() => router.push("/address/new")}
            >
              <PlusCircleIcon></PlusCircleIcon>Address
            </Button>
          </AlertDialogTitle>
          <Separator></Separator>
          <AlertDialogDescription className="pb-4 text-emboldBlack">
            <RadioGroup
              className="flex flex-col gap-4 mt-4"
              defaultValue={address?.find((el) => el.isDefault === true)?.id}
              onValueChange={(e) => setSelectedAddress(e)}
            >
              {address?.map((add) => {
                return (
                  <div key={add.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={add.id} id={add.id} />
                    <Label htmlFor={add.id} className="text-lg">
                      {add.firstName} {add.lastName}
                      <div className="">{add.addressLine1} </div>
                      <div className="">{add.addressLine2}</div>
                      <div className="">{add.city}</div>
                      <div className="">
                        {add.state} {add.pinCode}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex lg:flex-row flex-col justify-between w-full gap-2 items-center">
            <AlertDialogCancel
              className={cn(buttonVariants({ variant: "default" }), "w-40")}
            >
              Cancel
            </AlertDialogCancel>

            <Button className="w-40" onClick={handleCheckOut}>
              Checkout
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddressModal;
