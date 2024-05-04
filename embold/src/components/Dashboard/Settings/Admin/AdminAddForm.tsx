"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminCreationRequest, AdminValidator } from "@/lib/validators/Admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AdminAddFormProps {}

const AdminAddForm: FC<AdminAddFormProps> = ({}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminCreationRequest>({
    resolver: zodResolver(AdminValidator),
    defaultValues: {
      email: "",
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

  const { mutate: createAdmin, isLoading } = useMutation({
    mutationFn: async ({ email }: AdminCreationRequest) => {
      const payload: AdminCreationRequest = {
        email,
      };

      const { data } = await axios.post(
        "/api/dashboard/settings/admin/create",
        payload
      );

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err);

        if (err.response?.status === 404) {
          return toast.error("No Email Id recieved in server", {
            className:
              "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            style: {
              backgroundColor: "#F07167",
              color: "white",
              fontSize: "16px",
            },
          });
        }
        if (err.response?.status === 401) {
          return toast.error("No Email Id found in database", {
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
      queryClient.invalidateQueries({ queryKey: ["dashboardAdmin"] });
      router.refresh();
      reset();

      return toast.success("Admin Authorization Provided", {
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

  const onSubmit = (data: AdminCreationRequest) => {
    const payload: AdminCreationRequest = {
      email: data.email.toLowerCase(),
    };

    createAdmin(payload);
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
            {...register("email", {
              required: "email is required",
            })}
            placeholder="Email Id"
          ></Input>
          {errors.email && (
            <p className="text-sm text-red-300">{errors.email.message}</p>
          )}
          <Button
            variant={"secondary"}
            isLoading={isLoading}
            className="w-40 h-12"
          >
            Add Admin
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddForm;
