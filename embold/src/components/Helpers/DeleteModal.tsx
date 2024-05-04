"use client";

import { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { DeleteRequest } from "@/lib/validators/DeleteValidator";
import { toast } from "sonner";

interface DeleteModalProps {
  name?: string;
  id: string;
  path?: string;
}

const DeleteModal: FC<DeleteModalProps> = ({ name, id, path }) => {
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: async () => {
      const payload: DeleteRequest = { id };

      if (pathname?.includes("dashboard")) {
        const { data } = await axios.post(
          `/api/dashboard/${path}/delete`,
          payload
        );

        return data as string;
      } else {
        const { data } = await axios.post(`/api/${path}/delete`, payload);

        return data;
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error(
            "It is a parent category, delete it's subcategories first",
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
        if (err.response?.status === 402) {
          return toast.error(
            "This category contains some products, please remove those products first to delete this category",
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
        if (err.response?.status === 403) {
          return toast.error(
            "Cannot delete this category as it's been displayed on the homepage. To delete go to settings home page and remove the category from the option.",
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

      return toast.error("Something went wrong, please try again later", {
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
      if (pathname?.includes("dashboard")) {
        if (path === "categories") {
          queryClient.invalidateQueries({
            queryKey: ["dashboardCategories", "limitedCategories"],
          });
        }
        router.push(`/dashboard/${path}`);
        router.refresh();
      } else {
        router.refresh();
        router.push(`/${path}`);
      }
      return toast.success(`Your ${path} has been deleted.`, {
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className={pathname?.includes("dashboard") ? "w-40" : "w-full"}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="text-emboldBlack">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="pb-4 text-emboldBlack">
            This action cannot be undone. This will permanently delete your{" "}
            {path} <span className="font-bold">&apos;{name}&apos;</span> and
            remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            className={cn(buttonVariants({ variant: "destructive" }), "w-40")}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
