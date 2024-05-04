"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginCreationRequest, LoginValidator } from "@/lib/validators/Login";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../../../../../public/whiteLogo.png";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import GoogleLogo from "../../../../../public/google.svg";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [credentialsError, setCredentialsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginCreationRequest>({
    resolver: zodResolver(LoginValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCreationRequest) => {
    setIsLoading(true);
    const status = await signIn("credentials", {
      redirect: false,
      email: data.email.toLowerCase(),
      password: data.password,
      callbackUrl: origin ? `/${origin}` : "/",
    });

    setIsLoading(false);

    if (status?.status === 401) {
      setCredentialsError(true);
    }

    if (status?.ok) {
      router.push(origin ? `/${origin}` : "/");
    }
  };
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

  return (
    <div className="h-screen grainy w-full flex items-center justify-center text-emboldLight50">
      <div className="sm:shadow-xl px-8 pb-8 pt-12  rounded-xl space-y-8 w-[500px] relative bg-embold">
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
        <h1 className="font-semibold text-xl">Sign in to your account.</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-10 text-emboldBlack"
        >
          <div className="">
            <Input
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              type="email"
              className="bg-emboldLight50 placeholder:text-emboldBlack/70"
            />
            {errors.email && (
              <p className="text-xs text-red-300 md:text-red-500 mt-2">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Input
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              type={showPass ? "text" : "password"}
              className="bg-emboldLight50 placeholder:text-emboldBlack/70"
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
            {credentialsError && (
              <p className="text-sm text-red-600 font-bold mt-2 text-center">
                Either Email or Password is incorrect, <br />
                please enter correct Id & password to login.
              </p>
            )}
          </div>
          <Button
            isLoading={isLoading}
            variant={"secondary"}
            type="submit"
            color="primary"
          >
            Sign in
          </Button>
          <div className="text-emboldBlack flex items-center w-full gap-2">
            <div className="h-[1px] w-full bg-emboldLight50/50"></div>
            <div className="text-emboldLight50">OR</div>
            <div className="h-[1px] w-full bg-emboldLight50/50"></div>
          </div>
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant={"secondary"}
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
        <div className="flex items-center justify-between">
          <Link className="hover:underline" href={"/forgot"}>
            Forgot password?
          </Link>
          <p className="text-right">
            Don&apos;t have an account?{" "}
            <Link
              className="text-emboldLight50 hover:underline font-semibold"
              href={"/sign-up"}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
