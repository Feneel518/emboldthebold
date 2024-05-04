"use client ";

import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { WishlistOnProducts } from "@prisma/client";
import clsx from "clsx";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { boolean } from "zod";

interface NewWishlistButtonProps {
  isInWishlist: boolean;
  id: string;
  isProductPage?: boolean;
  isWishlistPage?: boolean;
}

const NewWishlistButton: FC<NewWishlistButtonProps> = ({
  isInWishlist,
  id,
  isProductPage,
  isWishlistPage,
}) => {
  const router = useRouter();
  const [clicked, setClicked] = useState(isInWishlist);

  const handleWishlist = async () => {
    setClicked(!clicked);
    const payload = { id };
    const response = await axios.post("/api/wishlist", payload);

    toast.success(`${response.data} wishlist`, {
      className:
        "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
      style: {
        backgroundColor: "#13505B",
        color: "white",
        fontSize: "16px",
      },
    });
    if (isWishlistPage) {
      window.location.reload();
    }

    router.refresh();
  };

  return (
    <div className="w-full">
      <Button
        className={clsx(`w-full group/wishlist hover:bg-red-300`, {
          "bg-red-300 hover:bg-red-400": clicked || isWishlistPage,
        })}
        variant={"outline"}
        onClick={() => handleWishlist()}
      >
        <div
          className={clsx(
            `text-emboldBlack group-hover/wishlist:text-white mr-2`,
            {
              "text-white": clicked || isWishlistPage,
            },
            {
              hidden: !isProductPage,
            }
          )}
        >
          {isProductPage &&
            (clicked ? "Remove from wishlist" : "Add to wishlist")}
        </div>
        <Heart
          className={clsx(`text-red-300 group-hover/wishlist:text-white`, {
            "text-white ": clicked || isWishlistPage,
          })}
        ></Heart>
      </Button>
    </div>
  );
};

export default NewWishlistButton;
