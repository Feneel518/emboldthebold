"use client";

import Loading from "@/components/Helpers/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartItem } from "@/hooks/use-cart";
import { OrderCreationRequest } from "@/lib/validators/Order";
import { Inventory } from "@/types/Inventory";
import { Product } from "@/types/Product";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "sonner";

interface OrdersEditorProps {}

const OrdersEditor: FC<OrdersEditorProps> = ({}) => {
  const router = useRouter();
  const { data: products, isLoading } = useQuery({
    queryKey: ["dashboardProducts"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/product/fetch");
      return data.product as Product[];
    },
  });

  const [selectedProduct, setSelectedProduct] = useState<string[]>([]);

  const [productArray, setProductArray] = useState<Product[]>([]);

  // product selection function
  const handleProduct = (
    value: { label: ""; value: string },
    index: number
  ) => {
    selectedProduct.splice(index, 1, value.value);
    setSelectedProduct([...selectedProduct]);

    const product = products!.filter((id) => id.id === selectedProduct[index]);

    productArray.splice(index, 1, product[0]);
    setProductArray([...productArray]);

    productArray[index].Inventory.map((attr) => {
      attr.AttributesOnInventory.sort((a, b) =>
        a.attributeValue.attributeId > b.attributeValue.attributeId ? 1 : -1
      );
    });
  };

  // inventory selection function
  const [selectedInventory, setSelectedInventory] = useState<string[]>([]);
  const [inventoryArray, setInventoryArray] = useState<Inventory[]>([]);

  const handleInventory = (
    value: { label: ""; value: string },
    index: number
  ) => {
    selectedInventory.splice(index, 1, value.value);
    setSelectedInventory([...selectedInventory]);

    const inventory = productArray[index].Inventory.filter(
      (id) => id.id === selectedInventory[index]
    );

    inventoryArray.splice(index, 1, inventory[0]);
    setInventoryArray([...inventoryArray]);
  };

  //   handling the payment info
  const [payment, setPayment] = useState<boolean>(false);
  const handlePayment = (
    value: { label: string; value: boolean },
    index: number
  ) => {
    setPayment(value.value);
  };

  // useForm

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      cartItem: [
        {
          price: 0,
          quantity: 1,
          inventoryId: "",
        },
      ],
      userName: "",
      userPhone: "",
      userEmail: "",
      isOnline: false,
      paid: payment,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cartItem",
  });
  const { mutate: createOrder } = useMutation({
    mutationFn: async ({
      cartItem,
      isOnline,
      paid,
      userEmail,
      userName,
      userPhone,
      status,
    }: OrderCreationRequest) => {
      const payload: OrderCreationRequest = {
        cartItem,
        isOnline,
        paid,
        userEmail,
        userName,
        userPhone,
        status,
      };

      const { data } = await axios.post("/api/dashboard/offlineOrder", payload);

      return data as string;
    },
    onError(err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("Unauthorized", {
            className:
              "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            style: {
              backgroundColor: "#F07167",
              color: "white",
              fontSize: "16px",
            },
          });
        }
      }
    },
    onSuccess() {
      router.push("/dashboard/orders");
      router.refresh();

      return toast.success("Your order was added", {
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

  const onSubmit = (data: OrderCreationRequest) => {
    const cart = data.cartItem.map((item, index) => ({
      ...item,
      inventoryId: selectedInventory[index],
    }));

    //   if (!item.Inventory || !item.product) return;
    //   items.push({
    //     product: {
    //       colour: {
    //         label: item.Inventory.AttributesOnInventory[0].attributeValue.name,
    //         value: item.Inventory.AttributesOnInventory[0].attributeValue.value,
    //       },
    //       image: item.product.Image[0].url,
    //       // @ts-ignore
    //       Inventory: [item.Inventory],

    //       name: item.product.name,
    //       size: item.Inventory.AttributesOnInventory[1].attributeValue.value,
    //     },
    //     quantity: item.quantity,
    //     price: item.price,
    //   });
    // });

    const payload: OrderCreationRequest = {
      cartItem: cart,
      isOnline: false,
      paid: payment,
      userEmail: data.userEmail,
      userName: data.userName,
      userPhone: data.userPhone,
      status: "DELIVERED",
    };
    createOrder(payload);
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (!products)
    return <div className="">Add new products to create an order.</div>;
  return (
    <div>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full bg-emboldBlack">
          <CardHeader>
            <CardTitle>Add Order</CardTitle>
            <CardDescription>order information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full  items-center gap-8">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="">Customer Email id</Label>
                <Input
                  {...register("userEmail", {
                    required: "User Email is required",
                  })}
                  type="email"
                  placeholder="Enter User Email"
                />
              </div>
              <div className="flex gap-8 ">
                <div className="flex w-full flex-col space-y-1.5">
                  <Label htmlFor="">Customer Name</Label>
                  <Input
                    {...register("userName", {
                      required: "User Name is required",
                    })}
                    type="text"
                    placeholder="Enter User Name"
                  />
                </div>
                <div className="flex w-full flex-col space-y-1.5">
                  <Label htmlFor="">Customer Phone Number</Label>
                  <Input
                    {...register("userPhone", {
                      required: "Phone Number is required",
                    })}
                    type="text"
                    min={10}
                    placeholder="Enter Phone Number"
                  />
                </div>
              </div>

              {fields.map((field, index) => {
                return (
                  <div className="flex flex-col gap-4" key={field.id}>
                    <div className="">
                      <h1 className="text-xl underline underline-offset-4">
                        Product {index + 1}
                      </h1>
                    </div>

                    {/* Product selection */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="">Select Product</Label>
                      <Select
                        className="h-16"
                        options={products?.map((cate) => {
                          return { label: cate.name, value: cate.id };
                        })}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "#D7D9CE20",
                            height: "50px",
                            borderRadius: "10px",
                            border: "none",
                            boxShadow: state.isFocused ? "0" : "0",
                          }),
                          menu: (base, state) => ({
                            ...base,
                            backgroundColor: "#040404",
                            borderRadius: "10px",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            color: "#040404",
                            backgroundColor: state.isFocused
                              ? "#D7D9CE"
                              : "white",
                            cursor: "pointer",
                          }),
                          singleValue: (provided, state) => ({
                            ...provided,
                            color: "#D7D9CE",
                          }),
                        }}
                        //   @ts-ignore
                        onChange={(value) => handleProduct(value, index)}
                      ></Select>
                    </div>

                    {/* Inventory Selection */}
                    {selectedProduct[index] && (
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Select Size and Colour</Label>
                          <Select
                            className="h-16"
                            options={productArray[index].Inventory.map(
                              (attr) => {
                                return {
                                  label: `colour: ${attr.AttributesOnInventory[1].attributeValue.name} | size: ${attr.AttributesOnInventory[0].attributeValue.value} | Quantity : ${attr.Quantity.quantity}`,
                                  value: attr.id,
                                };
                              }
                            )}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                backgroundColor: "#D7D9CE20",
                                height: "50px",
                                borderRadius: "10px",
                                border: "none",
                                boxShadow: state.isFocused ? "0" : "0",
                              }),
                              menu: (base, state) => ({
                                ...base,
                                backgroundColor: "#040404",
                                borderRadius: "10px",
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                color: "#040404",
                                backgroundColor: state.isFocused
                                  ? "#D7D9CE"
                                  : "white",
                                cursor: "pointer",
                              }),
                              singleValue: (provided, state) => ({
                                ...provided,
                                color: "#D7D9CE",
                              }),
                            }}
                            onChange={(value) =>
                              // @ts-ignore
                              handleInventory(value, index)
                            }
                          ></Select>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    {selectedInventory[index] && (
                      <div className=" flex gap-4">
                        <div className="flex w-full flex-col space-y-1.5">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            {...register(`cartItem.${index}.price`, {
                              valueAsNumber: true,
                            })}
                            type="number"
                            defaultValue={
                              inventoryArray[index].discountedPrice
                                ? inventoryArray[index].discountedPrice
                                : inventoryArray[index].price
                            }
                          ></Input>
                        </div>

                        <div className="flex w-full flex-col space-y-1.5">
                          <Label htmlFor="">Quantity</Label>
                          <Input
                            {...register(`cartItem.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            defaultValue={1}
                            min={1}
                            max={
                              inventoryArray[index] !== undefined
                                ? inventoryArray[index].Quantity.quantity
                                : 10
                            }
                            type="number"
                            placeholder="Enter quantity"
                          />
                        </div>
                      </div>
                    )}

                    {/* Buttons to append */}
                    <div className="flex justify-end gap-4  ">
                      {fields.length === index + 1 && (
                        <Button
                          variant={"secondary"}
                          onClick={() => {
                            append({
                              quantity: 1,
                              price: 0,
                              inventoryId: "  ",
                            });
                          }}
                        >
                          Add Product
                        </Button>
                      )}
                      {fields.length > 1 && (
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            remove(index);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Payment</Label>
                  <Select
                    className="h-16"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#D7D9CE20",
                        height: "50px",
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: state.isFocused ? "0" : "0",
                      }),
                      menu: (base, state) => ({
                        ...base,
                        backgroundColor: "#040404",
                        borderRadius: "10px",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        color: "#040404",
                        backgroundColor: state.isFocused ? "#D7D9CE" : "white",
                        cursor: "pointer",
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        color: "#D7D9CE",
                      }),
                    }}
                    //   @ts-ignore
                    onChange={handlePayment}
                    options={[
                      { label: "Paid", value: true },
                      { label: "UnPaid", value: false },
                    ]}
                  ></Select>
                </div>
              </div>
            </div>
            <div className="mt-8 flex w-full items-center justify-between ">
              <Button
                type="button"
                variant="ghost"
                className="hover:text-white"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button variant={"secondary"} type="submit" className="w-80">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default OrdersEditor;
