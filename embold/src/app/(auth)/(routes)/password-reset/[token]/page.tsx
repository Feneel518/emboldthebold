"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResetCreationRequest,
  ResetValidator,
} from "@/lib/validators/ResetPassword";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChevronLeft, Eye, EyeOff, Fingerprint } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Logo from "../../../../../../public/whiteLogo.png";

interface pageProps {
  params: {
    token: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  const router = useRouter();

  const { token } = params;

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
  const [passwordMatch, setIsPasswordMatch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetCreationRequest>({
    resolver: zodResolver(ResetValidator),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token,
    },
  });

  const { mutate: ForgotPassword } = useMutation({
    mutationFn: async ({
      password,
      confirmPassword,
      token,
    }: ResetCreationRequest) => {
      setIsLoading(true);
      const payload: ResetCreationRequest = {
        password,
        confirmPassword,
        token,
      };

      const { data } = await axios.post("/api/auth/reset", payload);
      setIsLoading(false);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 402) {
          return toast.error("No token found, please try resetting again.", {
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
          return toast.error(
            "Token is invalid, please try resetting the password again",
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
        if (err.response?.status === 405) {
          return toast.error("Token has already been used.", {
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
      router.push("/sign-in");

      return toast.success("Password changed successfully", {
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

  const onSubmit = (data: ResetCreationRequest) => {
    if (
      !data.password ||
      typeof data.password !== "string" ||
      data.password !== data.confirmPassword
    ) {
      setIsPasswordMatch(true);
      return toast.error("something went");
    }

    const payload: ResetCreationRequest = {
      password: data.password,
      confirmPassword: data.confirmPassword,
      token,
    };

    ForgotPassword(payload);
  };

  return (
    <div className="h-screen grainy w-full flex items-center justify-center text-emboldLight50">
      <div className="sm:shadow-xl px-8 pb-8 pt-12  rounded-xl space-y-8 w-[500px] bg-embold">
        <div className="flex items-center  justify-center">
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
          <h1 className="font-semibold text-2xl">Choose a new password.</h1>
          <p className="text-sm">You can reset your password here.</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-10"
        >
          <div className="">
            <div className="flex items-center gap-2 text-emboldBlack">
              <Input
                className="bg-emboldLight50 placeholder:text-emboldBlack/70"
                {...register("password", { required: "Password is required" })}
                placeholder="Enter a new Passowrd"
                type={isVisible ? "text" : "password"}
              />
              <div
                onClick={() => setIsVisible(!isVisible)}
                className="text-emboldLight50 p-2 rounded-lg hover:bg-emboldLight hover:text-emboldBlack cursor-pointer h-12 flex items-center justify-center"
              >
                {isVisible ? <Eye /> : <EyeOff />}
              </div>
            </div>
            {errors.password && (
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="">
            <div className="flex items-center gap-2 text-emboldBlack">
              <Input
                placeholder="Re-enter the password"
                {...register("confirmPassword", {
                  required: "Email is required",
                })}
                className="bg-emboldLight50 placeholder:text-emboldBlack/70"
                type={isConfirmVisible ? "text" : "password"}
              />
              <div
                onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                className="text-emboldLight50 p-2 rounded-lg hover:bg-emboldLight hover:text-emboldBlack cursor-pointer h-12 flex items-center justify-center"
              >
                {isConfirmVisible ? <Eye /> : <EyeOff />}
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-300 md:text-red-500 mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
              {passwordMatch && (
                <p className="text-xs text-red-300 md:text-red-500 mt-2 font-semibold">
                  Passwords do not match.
                </p>
              )}
            </div>
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
          <Link className="hover:underline flex items-center" href={"/forgot"}>
            <ChevronLeft className="w-4 h-4"></ChevronLeft> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
