"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ForgotCreationrequest,
  ForgotValidator,
} from "@/lib/validators/Forgot";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Logo from "../../../../../public/whiteLogo.png";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotCreationrequest>({
    resolver: zodResolver(ForgotValidator),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: ForgotPassword } = useMutation({
    mutationFn: async ({ email }: ForgotCreationrequest) => {
      const payload: ForgotCreationrequest = {
        email,
      };

      setIsLoading(true);

      const { data } = await axios.post("/api/auth/forgot", payload);

      setIsLoading(false);

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 402) {
          return toast.error(err.response.statusText, {
            className:
              "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            style: {
              backgroundColor: "#F07167",
              color: "white",
              fontSize: "16px",
            },
          });
        }
        if (err.response?.status === 403) {
          return toast.error(err.response.statusText, {
            className:
              "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            style: {
              backgroundColor: "#F07167",
              color: "white",
              fontSize: "16px",
            },
          });
        }
        return toast.error("Something went wrong please try again later.", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#F07167",
            color: "white",
            fontSize: "16px",
          },
        });
      }
    },
    onSuccess() {
      router.push("/forgot/success");

      return toast.success(
        "Email with password reset link has been sent to your mail id.",
        {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#13505B",
            color: "white",
            fontSize: "16px",
          },
        }
      );
    },
  });

  const onSubmit = async (data: ForgotCreationrequest) => {
    const payload: ForgotCreationrequest = {
      email: data.email.toLowerCase(),
    };

    ForgotPassword(payload);
  };

  return (
    <div className="h-screen grainy w-full flex items-center justify-center text-accent text-emboldLight50">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 bg-embold rounded-xl space-y-8 w-[500px]">
        <div className="flex items-center justify-center">
          <Link href={"/"}>
            <Image
              alt="Embold Logo"
              src={Logo}
              width={250}
              height={250}
            ></Image>
          </Link>
          <div className="h-[1px] bg-accent/50 mt-2"></div>
        </div>
        <div className="">
          <h1 className="font-semibold text-2xl">Reset password</h1>
          <p className="text-sm">
            Enter your email address to get instructions for resetting your
            password.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-10"
        >
          <div className="text-emboldBlack">
            <Input
              className="bg-emboldLight50 placeholder:text-emboldBlack/70"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              type="email"
            />
            {errors.email && (
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            variant={"secondary"}
            isLoading={isLoading}
            type="submit"
            color="primary"
          >
            Reset Password
          </Button>
        </form>
        <div className="flex items-center justify-between">
          <Link className="hover:underline flex items-center" href={"/sign-in"}>
            <ChevronLeft className="w-4 h-4"></ChevronLeft> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
