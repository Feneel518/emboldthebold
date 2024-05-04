"use client";

import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { User } from "next-auth";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserAccountNavProps {
  user: User;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  const router = useRouter();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant={"ghost"} size={"sm"} className="relative">
          Hi, {user.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-emboldBlack">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator></DropdownMenuSeparator>
        <DropdownMenuItem
          onClick={() => router.push("/")}
          className="cursor-pointer"
        >
          Home
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/wishlist")}
          className="cursor-pointer"
        >
          Your Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/orders")}
          className="cursor-pointer"
        >
          Your Orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/address")}
          className="cursor-pointer"
        >
          Your Addresses
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
