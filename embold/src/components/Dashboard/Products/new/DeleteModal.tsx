import { FC } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { CategoryDeleteRequest } from "@/lib/validators/CategoryValidtor";
import { ProductDeleteRequest } from "@/lib/validators/ProductValidator";

interface DeleteModalProps {
  name: string;
  id: string;
}

const DeleteModal: FC<DeleteModalProps> = ({ name, id }) => {
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: async () => {
      const payload: CategoryDeleteRequest | ProductDeleteRequest = {
        id,
      };

      if (pathname?.includes("admin")) {
        const { data } = await axios.post("/api/admin/delete", payload);
        return data as string;
      }
      if (pathname?.includes("address")) {
        const { data } = await axios.post("/api/address/delete", payload);
        return data as string;
      }
      if (pathname?.includes("categories")) {
        const { data } = await axios.post(
          "/api/dashboard/category/delete",
          payload
        );

        return data as string;
      } else if (pathname?.includes("products")) {
        const { data } = await axios.post(
          "/api/dashboard/product/delete",
          payload
        );

        return data as string;
      }
    },
    onError: (err) => {
      console.log(err);

      if (pathname?.includes("admin")) {
        if (err instanceof AxiosError) {
          console.log(err);

          if (err.response?.status === 401) {
            return toast.error(
              "Either user doesn't exist or is not an Admin.",
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
        }
        return toast("Something went wrong.", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#F07167",
            color: "white",
            fontSize: "16px",
          },
        });
      }

      if (pathname?.includes("categories")) {
        return toast.error(
          "This is a parent category, Delete subcategory to delete parent category.",
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
      if (pathname?.includes("products")) {
        return toast.error("Something went wrong", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#F07167",
            color: "white",
            fontSize: "16px",
          },
        });
      }
      if (pathname?.includes("address")) {
        return toast.error("Something went wrong", {
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
    onSuccess: () => {
      if (pathname?.includes("categories")) {
        queryClient.invalidateQueries({ queryKey: ["dashboardCategories"] });
        router.push("/dashboard/categories");
      } else if (pathname?.includes("products")) {
        queryClient.invalidateQueries({
          queryKey: ["dashboardProducts"],
        });
        router.push("/dashboard/products");
      } else if (pathname?.includes("address")) {
        router.push("/user/address");
      }

      router.refresh();

      if (pathname?.includes("categories")) {
        return toast.success("Your Admin has been deleted", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#13505B",
            color: "white",
            fontSize: "16px",
          },
        });
      }
      if (pathname?.includes("categories")) {
        return toast.success("Your category has been deleted", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#13505B",
            color: "white",
            fontSize: "16px",
          },
        });
      } else if (pathname?.includes("products")) {
        return toast.success("Your product has been deleted", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#13505B",
            color: "white",
            fontSize: "16px",
          },
        });
      } else if (pathname?.includes("address")) {
        return toast.success("Your address has been deleted", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#13505B",
            color: "white",
            fontSize: "16px",
          },
        });
      }
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        {pathname?.includes("admin") ? (
          <Trash className="hover:text-emboldBlack" />
        ) : (
          <Button className="md:w-40" variant="destructive">
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-emboldLight50 text-emboldBlack">
        <DialogHeader>
          <DialogTitle>Delete {pathname}</DialogTitle>
          <DialogDescription className="text-xs text-emboldBlack">
            This action cannot be undone. Are you sure you want to permanently
            delete this file from our servers?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <h1 className="text-xl ">
              Are you sure you want to delete "{name}"
            </h1>
          </div>
        </div>
        <DialogFooter className="flex gap-4">
          <DialogPrimitive.Close
            className={buttonVariants({ variant: "default" })}
          >
            Cancel
            {/* <Button type="button">Cancel</Button> */}
          </DialogPrimitive.Close>
          <Button
            onClick={() => handleDelete()}
            variant="destructive"
            type="button"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
