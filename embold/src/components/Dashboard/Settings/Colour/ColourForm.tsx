"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminCreationRequest, AdminValidator } from "@/lib/validators/Admin";
import {
  ColourCreationRequest,
  ColourValidator,
} from "@/lib/validators/Colour";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ColourFormProps {}

const ColourForm: FC<ColourFormProps> = ({}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ColourCreationRequest>({
    resolver: zodResolver(ColourValidator),
    defaultValues: {
      label: "",
      value: "",
    },
  });
  useEffect(() => {
    if (Object.keys(errors).length) {
      console.log(errors);

      for (const [_key, value] of Object.entries(errors)) {
        toast(`Something went wrong.${(value as { message: string }).message}`);
      }
    }
  }, [errors]);

  const { mutate: createColour, isLoading } = useMutation({
    mutationFn: async ({ label, value }: ColourCreationRequest) => {
      const payload: ColourCreationRequest = {
        label,
        value,
      };

      const { data } = await axios.post(
        "/api/dashboard/settings/colour/create",
        payload
      );

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err);
        if (err.response?.status === 401) {
          return toast.error("The colour already exist in the database", {
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
          return toast.error(
            "Hex value should be of 7 digits including the #.",
            {
              className:
                "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
              style: {
                backgroundColor: "#F07167",
                color: "white",
                fontSize: "16px",
              },
            }
          );
        }
      }
      return toast.error(
        "Something went wrong ,Your Admin Authorization was not added. Please try again.",
        {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#F07167",
            color: "white",
            fontSize: "16px",
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardColour"] });
      router.refresh();
      reset();

      return toast.success("Colour created", {
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

  const onSubmit = (data: ColourCreationRequest) => {
    const payload: ColourCreationRequest = {
      label: data.label,
      value: data.value,
    };

    createColour(payload);
  };
  return (
    <div>
      <div className="w-full">
        <form
          action=""
          className="flex items-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            {...register("label", {
              required: "Name of the colour",
            })}
            placeholder="Name of colour"
          ></Input>
          {errors.label && (
            <p className="text-sm text-red-300">{errors.label.message}</p>
          )}
          <Input
            {...register("value", {
              required: "Hex value is requires",
            })}
            placeholder="Hex value with #"
          ></Input>
          {errors.value && (
            <p className="text-sm text-red-300">{errors.value.message}</p>
          )}
          <Button
            variant={"secondary"}
            isLoading={isLoading}
            className="w-40 h-12 whitespace-nowrap"
          >
            Add Colour
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ColourForm;
