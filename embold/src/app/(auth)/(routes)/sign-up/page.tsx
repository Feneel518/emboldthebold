"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RegisterCreationRequest,
  RegisterValidator,
} from "@/lib/validators/Resgister";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Logo from "../../../../../public/whiteLogo.png";
import { Checkbox } from "@/components/ui/checkbox";
import { signIn } from "next-auth/react";
import GoogleLogo from "../../../../../public/google.svg";
import { useSearchParams } from "next/navigation";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterCreationRequest>({
    resolver: zodResolver(RegisterValidator),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      phoneNumber: "",
    },
  });

  const { mutate: Register } = useMutation({
    mutationFn: async ({
      email,
      name,
      password,
      phoneNumber,
    }: RegisterCreationRequest) => {
      setIsLoading(true);
      const payload: RegisterCreationRequest = {
        email,
        name,
        password,
        phoneNumber,
      };

      const { data } = await axios.post("/api/auth/sign-up", payload);
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
      }
      setIsLoading(false);

      return toast.error("Something went wrong, please try again later.", {
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
      setEmailSent(true);
    },
  });

  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");

  const onSubmit = (data: RegisterCreationRequest) => {
    const payload: RegisterCreationRequest = {
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      phoneNumber: data.phoneNumber,
    };

    Register(payload);
  };

  const [terms, setTerms] = useState<boolean>(false);

  const url = origin
    ? `http://localhost:3000/${origin}`
    : `http://localhost:3000`;

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: url });
    } catch (error) {
      console.log(error);
    }
  };

  if (emailSent) {
    return (
      <div className="">
        <h1 className="text-center text-2xl text-emboldBlack/80 mt-80">
          An email has been sent to your email id, please verify to login into
          your account.
        </h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen grainy w-full flex items-center justify-center text-emboldLight50 my-20 ">
      <div className="sm:shadow-xl px-8 pb-8 pt-12  rounded-xl space-y-8 w-[500px] relative bg-embold ">
        <Link href={"/"} className="flex items-center absolute top-4 left-4">
          <ChevronLeft className="w-4 h-4"></ChevronLeft> Home
        </Link>
        <div className="flex items-center justify-center">
          <Link href={"/"} className="">
            <Image
              src={Logo}
              alt="embold-logo"
              width={200}
              height={200}
            ></Image>
          </Link>
          <div className="h-[1px] bg-accent/50 mt-2"></div>
        </div>
        <h1 className="font-semibold text-xl">Create your Account</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-10 "
        >
          <div className="text-emboldBlack ">
            <Input
              className="bg-emboldLight50 placeholder:text-emboldBlack/70"
              {...register("name", { required: "Name is required" })}
              placeholder="Name"
              type="text"
            />
            {errors.name && (
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="text-emboldBlack ">
            <Input
              className="bg-emboldLight50 placeholder:text-emboldBlack/70"
              {...register("phoneNumber", {
                required: "Phone Number is required",
              })}
              placeholder="Phone Number"
              type="text"
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="text-emboldBlack ">
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
          <div className="text-emboldBlack flex items-center justify-start gap-2 ">
            <Input
              className="bg-emboldLight50 placeholder:text-emboldBlack/70"
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              type={showPass ? "text" : "password"}
            />
            <div
              onClick={() => setShowPass(!showPass)}
              className="text-emboldLight50 p-2 rounded-lg hover:bg-emboldLight hover:text-emboldBlack cursor-pointer h-12 flex items-center justify-center"
            >
              {showPass ? <Eye /> : <EyeOff />}
            </div>
            {errors.password && (
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 ">
            <Checkbox
              checked={terms}
              onCheckedChange={() => setTerms(!terms)}
              id="terms"
              className=" "
            />
            <Link
              href={"/terms-conditions"}
              className="text-sm font-medium leading-none text-emboldLight50 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </Link>
          </div>
          <Button
            disabled={!terms}
            isLoading={isLoading}
            type="submit"
            className=""
            variant={"secondary"}
          >
            Register
          </Button>
          <div className="text-emboldBlack flex items-center w-full gap-2">
            <div className="h-[1px] w-full bg-emboldLight50/50"></div>
            <div className="text-emboldLight50">OR</div>
            <div className="h-[1px] w-full bg-emboldLight50/50"></div>
          </div>
          <Button
            type="button"
            className=""
            variant={"secondary"}
            onClick={handleGoogleLogin}
          >
            {" "}
            <Image
              src={GoogleLogo}
              alt="GoogleLogo"
              width={40}
              height={40}
              className="mr-2 w-4"
            ></Image>{" "}
            Google
          </Button>
        </form>

        <p className="text-right">
          Have an account?{" "}
          <Link
            className="text-emboldLight50 hover:underline font-semibold"
            href={"/sign-in"}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
