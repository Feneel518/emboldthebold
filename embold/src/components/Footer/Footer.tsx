"use client";

import { Input } from "@/components/ui/input";

// import { NewsLetterCreationRequest } from "@/lib/validators/NewsLetter";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";

import WhiteLogo from "../../../public/whiteLogo.png";
import MaxWidthWrapper from "../Utilities/MaxWidthWrapper";
import { NewsLetterCreationRequest } from "@/lib/validators/NewsLetter";
import instagram from "../../../public/Insta PNG.png";
import facebook from "../../../public/FB PNG.png";
import linkedin from "../../../public/linkedin PNG.png";
import { toast } from "sonner";

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
  const pathname = usePathname();
  const router = useRouter();
  if (
    pathname?.includes("dashboard") ||
    pathname?.includes("sign-in") ||
    pathname?.includes("sign-up") ||
    pathname?.includes("password-reset") ||
    pathname?.includes("forgot")
  )
    return null;

  const [email, setEmail] = useState<string>("");

  const { mutate: createNewsLetter } = useMutation({
    mutationFn: async ({ email }: NewsLetterCreationRequest) => {
      const payload: NewsLetterCreationRequest = {
        email,
      };
      const { data } = await axios.post("api/newsletter", payload);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err);

        if (err.response?.status === 401) {
          return toast.error("Already subscribed to NewsLetter", {
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
      return toast.error("Something went wrong.", {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#F07167",
          color: "white",
          fontSize: "16px",
        },
      });
    },
    // on success
    onSuccess: () => {
      router.refresh();

      setEmail("");

      return toast.success(
        "Welcome onboard! You're a part of the Embold fam now.",
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

  const handleNewsLetter = async () => {
    const payload: NewsLetterCreationRequest = {
      email: email,
    };
    createNewsLetter(payload);
  };
  return (
    <div className="">
      <div className="bg-emboldBlack lg:h-96 text-white flex items-center justify-center ">
        <MaxWidthWrapper>
          <div className=" flex justify-between lg:items-center w-[75%] mx-auto lg:flex-row flex-col max-lg:gap-10 my-10">
            <div className="">
              <div className="flex flex-col items-center">
                <Link
                  href="/"
                  className=" relative flex items-center  text-embold "
                >
                  <Image
                    src={WhiteLogo}
                    alt="Embold Logo"
                    width={256}
                    height={96}
                    className="w-64 h-24"
                  ></Image>
                </Link>
                <div className="text-start text-emboldLight/50 max-lg:text-center">
                  <h3 className="text-center">COPYRIGHT © 2023 - EMBOLD</h3>
                  <h3 className="text-center">ALL RIGHTS RESERVED</h3>
                </div>

                <div className="text-start text-emboldLight/50 max-lg:text-center mt-4">
                  <h3 className="text-center">F-54, First Floor, Above OOTD</h3>
                  <h3 className="text-center">
                    Beside Kotak Mahindra Bank, Kirti Nagar
                  </h3>
                  <h3 className="text-center">New Delhi, Delhi - 110015</h3>
                  <h3 className="text-center">+91 7838933195</h3>
                </div>
              </div>
            </div>
            <div className="flex items-start  max-lg:flex-col max-lg:items-center ">
              <div className="flex flex-col gap-6 text-emboldLight/70 ">
                <h1 className="text-2xl text-white max-lg:text-center lg:-ml-2">
                  About Embold
                </h1>
                <div className="flex flex-col gap-1 text-start">
                  <Link
                    href={"/about"}
                    className="cursor-pointer hover:text-white hover:underline max-lg:text-center"
                  >
                    About us
                  </Link>
                  <Link
                    href={"/FAQ"}
                    className="cursor-pointer hover:text-white hover:underline max-lg:text-center"
                  >
                    FAQ&apos;s
                  </Link>
                  <Link
                    href={"/privacy-policy"}
                    className="cursor-pointer hover:text-white hover:underline max-lg:text-center"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href={"/shipping-delivery"}
                    className="cursor-pointer hover:text-white hover:underline max-lg:text-center"
                  >
                    Shipping and Delivery
                  </Link>
                  <Link
                    href={"/return-exhchange"}
                    className="cursor-pointer hover:text-white hover:underline max-lg:text-center"
                  >
                    Return and Exchange
                  </Link>

                  <Link
                    href={"/terms-conditions"}
                    className="cursor-pointer hover:text-white hover:underline max-lg:text-center"
                  >
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 text-emboldLight/70 max-lg:items-center ">
              <h1 className="text-start text-2xl text-white ">Newsletter</h1>
              <div className="flex flex-col gap-1 text-start max-lg:items-center max-lg:text-center">
                <p className="">SUBSCRIBE TO OUR NEWSLETTER</p>
                <div className="flex items-center gap-2  max-lg:ml-3">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                  ></Input>
                  <Mail
                    onClick={handleNewsLetter}
                    className="h-12 w-16 cursor-pointer rounded-full p-2 hover:bg-emboldLight hover:text-emboldBlack"
                  ></Mail>
                </div>
                <div className="mt-2 flex items-center gap-4 ">
                  <div
                    className="w-10 h-10 cursor-pointer"
                    onClick={() =>
                      redirect("https://www.instagram.com/emboldthebold/")
                    }
                  >
                    <Image
                      src={instagram}
                      alt="Instagram Logo"
                      width={200}
                      height={200}
                    ></Image>
                  </div>
                  <div
                    className="w-10 h-10 cursor-pointer"
                    onClick={() =>
                      redirect("https://www.facebook.com/emboldthebold/")
                    }
                  >
                    <Image
                      src={facebook}
                      alt="Facebook Logo"
                      width={200}
                      height={200}
                    ></Image>
                  </div>
                  <div
                    className="w-10 h-10 cursor-pointer"
                    onClick={() =>
                      redirect(
                        "https://www.linkedin.com/company/emboldthebold/"
                      )
                    }
                  >
                    <Image
                      src={linkedin}
                      alt="Instagram Logo"
                      width={200}
                      height={200}
                    ></Image>
                  </div>
                </div>
                <a
                  href={
                    "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=ssupport@embold.co.in"
                  }
                  className="text-start text-emboldLight/50 "
                >
                  <h3 className="">embold.helpdesk@gmail.com</h3>
                </a>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <div className="bg-emboldBlack text-white/70 flex items-center justify-center flex-col  gap-2">
        <div className="bg-emboldLight50/20 w-full h-[1px]"></div>
        <div className="flex items-center gap-2">
          Powered by{" "}
          <div
            onClick={() => redirect("https://www.feneelpatel.com")}
            className="hover:underline hover:underline-offset-2 cursor-pointer"
          >
            Feneel.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

export function redirect(link: string) {
  window.location.assign(link);

  return <></>;
}
