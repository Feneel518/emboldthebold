"use client";

import { FInput } from "@/components/ui/FInput";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AddressCreationRequest,
  AddressValidator,
} from "@/lib/validators/Address";

import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Address } from "@/types/Address";
import { useRouter } from "next/navigation";

import { State, City, ICity } from "country-state-city";
import Select from "react-select";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import DeleteModal from "@/components/Helpers/DeleteModal";

interface AddressEditorProps {
  address?: Address;
}

const AddressEditor: FC<AddressEditorProps> = ({ address }) => {
  const router = useRouter();
  const [isDefault, setIsDefault] = useState<boolean>(
    address ? address.isDefault : false
  );

  const [state, setState] = useState<{ name: string; code: string } | null>(
    null
  );
  const [city, setCity] = useState<{ name: string } | null>(null);

  const [cities, setCities] = useState<{ name: string }[] | undefined>(
    undefined
  );

  useEffect(() => {
    const citiess = state?.code && City.getCitiesOfState("IN", state.code);

    // @ts-ignore
    setCities(citiess);
  }, [state]);
  const { data: Session } = useSession();

  const states = State.getStatesOfCountry("IN");

  const { mutate: createAddress } = useMutation({
    mutationFn: async ({
      id,
      addressLine1,
      city,
      country,
      email,
      firstName,
      isDefault,
      lastName,
      phoneNumber,
      pinCode,
      state,
      addressLine2,
    }: AddressCreationRequest) => {
      const payload: AddressCreationRequest = {
        id,
        addressLine1,
        city,
        country,
        email,
        firstName,
        isDefault,
        lastName,
        phoneNumber,
        pinCode,
        state,
        addressLine2,
      };

      let data;
      if (address) {
        data = await axios.put("/api/address/update", payload);
        return data;
      }
      data = await axios.post("/api/address/create", payload);

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("Please sign in to continue", {
            className:
              "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            style: {
              backgroundColor: "#F07167",
              color: "white",
              fontSize: "16px",
            },
          });
        }
        if (err.response?.status === 402) {
          return toast.error("A user can only add upto 7 addresses.", {
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
      return toast.error("Something went wrong, please try again later", {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#F07167",
          color: "white",
          fontSize: "16px",
        },
      });
    },
    onSuccess: () => {
      router.back();

      router.refresh();

      reset();

      if (address) {
        return toast.success("Your Address has been updated.", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#13505B",
            color: "white",
            fontSize: "16px",
          },
        });
      }
      return toast.success("New Address has been added", {
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

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(AddressValidator),
    defaultValues: {
      addressLine1: address ? address.addressLine1 : "",
      addressLine2: address ? address.addressLine2 : "",
      city: address ? address.city : "",
      country: "India",
      email: address ? address.email : "",
      firstName: address ? address.firstName : "",
      isDefault: address ? address.isDefault : false,
      lastName: address ? address.lastName : "",
      phoneNumber: address ? address.phoneNumber : "",
      pinCode: address ? address.pinCode : "",
      state: address ? address.state : "",
    },
  });

  // useEffect to check for errors
  useEffect(() => {
    if (Object.keys(errors).length) {
      console.log(errors);

      for (const [_key, value] of Object.entries(errors)) {
        toast.error("Something went wrong!");
      }
    }
  }, [errors]);

  const onSubmit = (data: AddressCreationRequest) => {
    const payload = {
      id: address ? address.id : "",
      firstName: data.firstName,
      lastName: data.lastName,
      email: Session?.user?.email
        ? Session.user.email.toLowerCase()
        : data.email.toLowerCase(),
      country: data.country,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 ? data.addressLine2 : "",
      city: city ? city.name : "",
      state: state ? state.name : "",
      pinCode: data.pinCode,
      phoneNumber: data.phoneNumber ? data.phoneNumber : "",
      isDefault: isDefault,
    };

    createAddress(payload);
  };

  return (
    <div className="border relative rounded-md w-full lg:p-8 p-4 lg:w-[1000px] shadow-xl ">
      <div
        onClick={() => router.back()}
        className={cn(
          "absolute top-2 left-2 flex items-center cursor-pointer",
          buttonVariants({ variant: "ghost" })
        )}
      >
        <ChevronLeft className="w-4 h-4"></ChevronLeft>back
      </div>
      <div className="mt-8">
        <h1 className="text-2xl font-semibold">
          {address ? "Update your address" : "Add a new address"}
        </h1>
        <Separator></Separator>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-10 gap-4"
        >
          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label htmlFor="Country">Country</Label>
            <FInput className="col-span-7" disabled value={"India"}></FInput>
          </div>

          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>First Name</Label>
            <div className="col-span-7">
              <FInput {...register("firstName", { required: true })}></FInput>
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.firstName?.message}
              </p>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>Last Name</Label>
            <div className="col-span-7">
              <FInput {...register("lastName", { required: true })}></FInput>
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.lastName?.message}
              </p>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>Phone Number</Label>
            <div className="col-span-7">
              <FInput {...register("phoneNumber", { required: true })}></FInput>
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.phoneNumber?.message}
              </p>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>Email</Label>
            <div className="col-span-7">
              <FInput {...register("email", { required: true })}></FInput>
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.email?.message}
              </p>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>Pincode</Label>
            <div className="col-span-7">
              <FInput {...register("pinCode", { required: true })}></FInput>
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.pinCode?.message}
              </p>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>Flat, House no., Building, Company</Label>
            <div className="col-span-7">
              <FInput
                {...register("addressLine1", { required: true })}
              ></FInput>
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.addressLine1?.message}
              </p>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>Area, Street, Sector, Village</Label>
            <div className="col-span-7">
              <FInput {...register("addressLine2")}></FInput>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>State</Label>
            <div className="col-span-7">
              <Select
                className=""
                options={states?.map((state) => {
                  return { label: state.name, value: state.isoCode };
                })}
                defaultValue={
                  address && {
                    label: address.state,
                    value: address.state,
                  }
                }
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#D7D9CE",
                    "::placeholder": {
                      color: "black",
                    },
                    height: "40px",
                    borderRadius: "8px",
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
                    color: state.isFocused ? "white" : "#040404",
                    backgroundColor: state.isFocused ? "#040404" : "white",
                    cursor: "pointer",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
                onChange={(e) => setState({ name: e?.label!, code: e?.value! })}
              ></Select>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-8 items-center">
            <Label>Town / City</Label>
            <div className="col-span-7">
              <Select
                className=""
                defaultValue={
                  address && {
                    label: address.city,
                    value: address.city,
                  }
                }
                options={cities?.map((state) => {
                  return { label: state.name, value: state.name };
                })}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#D7D9CE",
                    "::placeholder": {
                      color: "black",
                    },
                    height: "40px",
                    borderRadius: "8px",
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
                    color: state.isFocused ? "white" : "#040404",
                    backgroundColor: state.isFocused ? "#040404" : "white",
                    cursor: "pointer",
                  }),
                  singleValue: (provided, state) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
                onChange={(e) => setCity({ name: e?.label! })}
              ></Select>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-8 gap-4 items-center flex ">
            <Label>Add as default</Label>
            <Switch
              checked={isDefault}
              onClick={() => setIsDefault(!isDefault)}
              className=" data-[state=checked]:bg-emboldLight"
            ></Switch>
          </div>

          <div className="flex items-center gap-8 mt-2">
            <Button className="w-full " type="submit">
              {address ? "Update address" : "Add address"}
            </Button>
            {/* {address && (
              <Button onClick className="w-full mt-2" variant={"destructive"}>
                Delete address
              </Button>
            )} */}
            {address && (
              <DeleteModal
                id={address.id}
                path="address"
                name={address.addressLine1}
              ></DeleteModal>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressEditor;
