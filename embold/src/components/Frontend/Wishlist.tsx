"use client";

import { Wishlist } from "@/types/Wishlist";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";

import { FC, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
  isWishlist: boolean;
  isProduct: boolean;
  includedInWishlist: boolean;
}

const WishlistButton: FC<WishlistButtonProps> = ({
  productId,
  isWishlist,
  isProduct,
  includedInWishlist,
}) => {
  const router = useRouter();

  const { data: Session } = useSession();

  let id: [] = [];

  const [clicked, setClicked] = useState<boolean>(includedInWishlist);
  const [prodId, setProdId] = useState<string>(productId);

  if (!Session?.user) {
    id = [];
  }

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await axios.get("/api/wishlist/fetch");

      return data.wishlist as Wishlist;
    },
  });

  const handleWishList = async () => {
    if (!Session?.user) {
      toast("Please Login to add items to wishlist.");
      return;
    }
    setClicked(!clicked);
    setProdId(productId);
    const payload = {
      id: prodId,
    };
    createWishlist(payload);
  };

  const { mutate: createWishlist } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const payload = { id };

      const { data } = await axios.post("/api/wishlist", payload);

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error("Unauthorized, please sign in to continue.", {
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
    },
    onSuccess: (data) => {
      toast.success(`${data} wishlist`, {
        className:
          "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
        style: {
          backgroundColor: "#13505B",
          color: "white",
          fontSize: "16px",
        },
      });

      if (isWishlist) {
        window.location.reload();
        // router.refresh();
      }
    },
  });

  if (isProduct) {
    return (
      <div className="">
        <Button
          onClick={() => handleWishList()}
          variant="outline"
          className=" w-full border-black"
        >
          {clicked ? "Remove from" : "Add to "} WishList {"  "}{" "}
          <Heart
            className={`${
              clicked && "fill-emboldRed"
            } ml-2 w-4 text-emboldRed duration-100 ease-in-out transition-all hover:fill-emboldRed/50`}
          ></Heart>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => handleWishList()}
      className={
        clicked
          ? "bg-emboldRed w-full hover:bg-emboldRed/50"
          : `w-full bg-emboldRed/20 hover:bg-emboldRed group`
      }
    >
      <Heart
        className={`${
          clicked && "fill-white"
        } text-emboldRed duration-100 ease-in-out group-hover:fill-white transition-all hover:fill-emboldRed/50`}
      />
    </Button>
  );
};

export default WishlistButton;
