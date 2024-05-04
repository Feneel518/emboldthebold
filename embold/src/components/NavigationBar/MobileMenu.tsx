"use client";

import { signOut, useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ChevronDown, ChevronRight, Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import UserAccountNav from "./UserAccountNav";
import Cart from "../Cart/Cart";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import SearchBar from "./SearchBar";
import { Category } from "@/types/Category";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import NavItem from "./NavItem";
import { cn } from "@/lib/utils";
import Image from "next/image";
import MobileCategories from "./MobileCategories";
import { Session } from "next-auth";

interface MobileMenuProps {
  Session: Session | null;
}

const MobileMenu: FC<MobileMenuProps> = ({ Session }) => {
  const [open, setOpen] = useState(false);

  const { items } = useCart();

  const handleSignOut = () => {
    try {
      signOut({ callbackUrl: "/sign-in" });
      toast.success("Signed out successfully", {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#13505B",
          color: "white",
          fontSize: "16px",
        },
      });
    } catch (error) {
      toast.error("Something went wrong, please try again", {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#F07167",
          color: "white",
          fontSize: "16px",
        },
      });
    }
  };
  return (
    // <div className=""></div>
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger className="group -m-2 flex items-center p-2 ">
        <Menu
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-emboldBlack/70 group-hover:text-emboldBlack"
        ></Menu>
      </SheetTrigger>
      <SheetContent className="bg-white text-emboldBlack flex w-full flex-col pr-0 h-full ">
        <div className="">Menu</div>
        <Separator className="w-[90%]"></Separator>

        {Session?.user ? (
          <div className="flex flex-col">
            <div className="flex flex-col items-start justify-start gap-2 ">
              <div className="flex flex-col space-y-0.5 leading-none">
                <p className="font-medium text-sm text-emboldBlack">
                  Hi, {Session.user.name}
                </p>
              </div>
              <Separator className="w-40 bg-emboldBlack/20"></Separator>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <SheetClose asChild>
                <Link href={"/"} className="cursor-pointer">
                  Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/cart"} className="cursor-pointer">
                  Your Cart ({items.length})
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/wishlist"} className="cursor-pointer">
                  Your Wishlist
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/orders"} className="cursor-pointer">
                  Your Orders
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/address"} className="cursor-pointer">
                  Your Addresses
                </Link>
              </SheetClose>
              <Separator className="w-40 bg-emboldBlack/20"></Separator>
              <MobileCategories setOpen={setOpen}></MobileCategories>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Separator className="w-40 bg-emboldBlack/20"></Separator>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <SheetClose asChild>
                <div onClick={handleSignOut} className="cursor-pointer">
                  Sign out
                </div>
              </SheetClose>
              <Separator className="w-40 bg-emboldBlack/20"></Separator>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 mt-4">
              <SheetClose asChild>
                <Link href={"/"} className="cursor-pointer">
                  Home
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/cart"} className="cursor-pointer">
                  Your Cart ({items.length})
                </Link>
              </SheetClose>
              <Separator className="w-40 bg-emboldBlack/20"></Separator>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <MobileCategories setOpen={setOpen}></MobileCategories>
              <Separator className="w-40 bg-emboldBlack/20"></Separator>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <SheetClose asChild>
                <Link
                  href={"/sign-in"}
                  className={(buttonVariants({ variant: "ghost" }), "w-fit")}
                >
                  Sign in
                </Link>
              </SheetClose>
              <Separator className="w-40 bg-emboldBlack/20"></Separator>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
