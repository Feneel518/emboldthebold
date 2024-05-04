"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DeliveryStatusCreationRequest,
  DeliveryStatusValidator,
} from "@/lib/validators/DeliveryStatus";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "sonner";
interface ShippingStatusProps {
  orderId: string | null;
  orderStatus: string | null;
  courierName: string | null;
  courierDocketId: string | null;
}

const ShippingStatus: FC<ShippingStatusProps> = ({
  orderStatus,
  courierDocketId,
  courierName,
  orderId,
}) => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    orderStatus
  );

  const filteredStatus = [
    { label: "ORDERED", value: "ORDERED" },
    { label: "IN_TRANSIT", value: "IN_TRANSIT" },
    { label: "DELIVERED", value: "DELIVERED" },
    { label: "DELIVERY_UNSUCCESSFUL", value: "DELIVERY_UNSUCCESSFUL" },
    { label: "EXCHANGE_RETURN_INITIATED", value: "EXCHANGE_RETURN_INITIATED" },
    { label: "PRODUCT_PICKED_UP", value: "PRODUCT_PICKED_UP" },
    { label: "PRODUCT_RECEIVED", value: "PRODUCT_RECEIVED" },
    { label: "REFUND_INITIATED", value: "REFUND_INITIATED" },
    { label: "REFUND_ON_HOLD", value: "REFUND_ON_HOLD" },
    { label: "REFUNDED", value: "REFUNDED" },
  ].filter((a) => a.label !== selectedStatus);

  const statusHandler = (e: any) => {
    setSelectedStatus(e.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryStatusCreationRequest>({
    resolver: zodResolver(DeliveryStatusValidator),
    defaultValues: {
      courierDocketId: courierDocketId ? courierDocketId : "",
      courierName: courierName ? courierName : "",
      status: orderStatus ? orderStatus : "ORDERED",
    },
  });

  const onSubmit = (data: DeliveryStatusCreationRequest) => {
    const paylaod: DeliveryStatusCreationRequest = {
      courierDocketId: data.courierDocketId,
      courierName: data.courierName,
      status: selectedStatus ? selectedStatus : orderStatus!,
      orderId: orderId ? orderId : undefined,
    };

    updateOrder(paylaod);
  };

  const { mutate: updateOrder, isLoading } = useMutation({
    mutationFn: async ({
      courierDocketId,
      courierName,
      status,
      orderId,
    }: DeliveryStatusCreationRequest) => {
      const payload: DeliveryStatusCreationRequest = {
        orderId,
        courierDocketId,
        courierName,
        status,
      };

      const { data } = await axios.post(
        "/api/dashboard/orders/update",
        payload
      );

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err);
      }
    },
    onSuccess: () => {
      router.push("/dashboard/orders");
      return toast.success("The order has been updated.", {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#13505B",
          color: "white",
          fontSize: "16px",
        },
      });
    },
  });

  return (
    <div className="">
      <div className="">
        <h2>Update the delivery status.</h2>
      </div>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-3 items-start  justify-between mt-4 gap-8"
      >
        <div className="w-full flex flex-col gap-2">
          <Label>Order Status</Label>
          <Select
            className="h-16 text-emboldBlack"
            defaultValue={{ label: orderStatus, value: orderStatus }}
            options={filteredStatus.map((stat) => {
              return {
                label: stat.label,
                value: stat.value,
              };
            })}
            styles={{
              control: (base, state) => ({
                ...base,
                border: "1px solid #040404",
                height: "2.5rem",
                boxShadow: state.isFocused ? "0" : "0",
                background: "#1F1F1F",
                "&:hover": {
                  border: "1px solid #040404)",
                },
                color: "white",
              }),
              singleValue: (provided, state) => ({
                ...provided,
                color: "#D7D9CE",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#CDEAEC",
              },
            })}
            onChange={statusHandler}
          ></Select>
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <Label>Courier Name</Label>
          <Input
            type="text"
            {...register("courierName", { required: true })}
          ></Input>
        </div>
        <div className="w-full flex flex-col gap-2">
          <Label>Courier Docket Id</Label>
          <Input
            type="text"
            {...register("courierDocketId", { required: true })}
          ></Input>
        </div>
        <Button
          isLoading={isLoading}
          className="col-span-3"
          variant={"secondary"}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default ShippingStatus;
