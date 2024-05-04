"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Select from "react-select";
import {
  BannerCreationRequest,
  BannerValidator,
} from "@/lib/validators/Banner";
import { Category } from "@/types/Category";
import { Separator } from "@/components/ui/separator";
import { uploadMultipleToS3 } from "@/lib/s3";

interface BannerFormProps {}

const BannerForm: FC<BannerFormProps> = ({}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: categories, isLoading: loadingData } = useQuery({
    queryKey: ["dashboardCategories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/categories/fetchActive");
      return data.categories as Category[];
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BannerCreationRequest>({
    resolver: zodResolver(BannerValidator),
    defaultValues: {
      image: "",
      categoryId: "",
    },
  });

  // useEffect to check for errors
  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        console.log(errors);

        toast("Something went wrong.");
      }
    }
  }, [errors]);

  const { mutate: createBanner } = useMutation({
    mutationFn: async ({
      image,
      categoryId,
      mobileImage,
    }: BannerCreationRequest) => {
      const payload: BannerCreationRequest = {
        image,
        categoryId,
        mobileImage,
      };

      const { data } = await axios.post(
        "/api/dashboard/banner/create",
        payload
      );

      return data as string;
    },
    // if error
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 407) {
          return toast.error("Could not update banner.", {
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
      return toast.error(
        "Something went wrong, Your banner was not uploaded. Please try again.",
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
    },
    // on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["BannerData"] });
      router.refresh();

      return toast.success("New Banner has been added", {
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

  const [isloading, setIsLoading] = useState<boolean>(false);
  const [key, setKey] = useState<string>();
  const [mobileKey, setMobileKey] = useState<string>();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const handleCategory = (value: { label: string; value: string }) => {
    setSelectedCategory(value.value);
  };
  const handleBanner = async () => {
    if (key) {
      const payload: BannerCreationRequest = {
        image: key,
        categoryId: selectedCategory,
        mobileImage: mobileKey,
      };
      createBanner(payload);
    }
  };

  const uploadImages = async (
    e: UIEvent & { target: HTMLInputElement & { files: Array<string> } }
  ) => {
    const files = e.target.files;
    setIsLoading(true);
    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        // @ts-ignore
        const link = await uploadMultipleToS3(file);
        setKey(link);
      }
      setIsLoading(false);
    }
  };
  const uploadMobileImages = async (
    e: UIEvent & { target: HTMLInputElement & { files: Array<string> } }
  ) => {
    const files = e.target.files;
    setIsLoading(true);
    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        // @ts-ignore
        const link = await uploadMultipleToS3(file);
        setMobileKey(link);
      }
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Separator className="mb-4"></Separator>
      <form
        className="flex flex-col gap-8"
        action=""
        // @ts-ignore
        onSubmit={handleSubmit(handleBanner)}
      >
        <div className="space-y-1">
          <Label htmlFor="picture">Banner Image {"   "} (1376px * 774px)</Label>
          <Input
            // @ts-ignore
            onChange={uploadImages}
            className="cursor-pointer h-10"
            accept="image/*"
            id="picture"
            type="file"
            name="file"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="picture">
            Banner Image for Mobile{"   "} (335px * 500px)
          </Label>
          <Input
            // @ts-ignore
            onChange={uploadMobileImages}
            className="cursor-pointer h-10"
            accept="image/*"
            id="mobilePicture"
            type="file"
            name="file"
          />
        </div>
        <div className="space-y-1">
          <Label>Select Category</Label>
          <Select
            className="text-emboldBlack "
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "#D7D9CE20",
                height: "50px",
                borderRadius: "10px",
                border: "none",
                boxShadow: state.isFocused ? "0" : "0",
              }),
              menu: (base, state) => ({
                ...base,
                backgroundColor: "#040404",
                borderRadius: "10px",
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isFocused ? "white" : "#040404",
                backgroundColor: state.isFocused ? "#040404" : "white",
                cursor: "pointer",
              }),
              singleValue: (provided, state) => ({
                ...provided,
                color: "#D7D9CE",
              }),
            }}
            options={categories?.map((cate) => {
              return { label: cate.name, value: cate.slug };
            })}
            //   @ts-ignore
            onChange={handleCategory}
          ></Select>
        </div>

        <Button
          className="w-40 "
          variant={"secondary"}
          disabled={!key}
          isLoading={isloading}
        >
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default BannerForm;
