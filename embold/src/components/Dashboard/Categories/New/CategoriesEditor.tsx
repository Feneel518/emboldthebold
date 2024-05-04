"use client";

import {
  CategoryCreationRequest,
  CategoryValidator,
} from "@/lib/validators/CategoryValidtor";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Select from "react-select";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Cloud, Loader2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { uploadMultipleToS3 } from "@/lib/s3";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import Select from "react-select";
import { Category } from "@/types/Category";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/Helpers/DeleteModal";

interface CategoriesEditorProps {
  category?: Category;
}

const CategoriesEditor: FC<CategoriesEditorProps> = ({ category }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [parentCategory, setParentCategory] = useState<string | null>(
    category ? category.parentId! : null
  );

  const [key, setKey] = useState<string | null>(
    category?.image ? category.image : null
  );

  const [file, setFile] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(
    category ? category.isActive : false
  );
  const [isOnHome, setIsOnHome] = useState<boolean>(
    category ? category.showOnHome : false
  );

  const { data: categories, isLoading: loadingData } = useQuery({
    queryKey: ["dashboardCategories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/categories/fetchActive");
      return data.categories as Category[];
    },
  });

  let defaultValues = {};

  if (category) {
    defaultValues = {
      id: category.id,
      name: category.name,
      image: category.image === null ? "" : category.image,
      parentId: category.parentId ?? "",
      showOnHome: category.showOnHome,
      isActive: category.isActive,
    };
  } else {
    defaultValues = {
      name: "",
      image: "",
      parentId: "",
      showOnHome: false,
      isActive: false,
    };
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryCreationRequest>({
    resolver: zodResolver(CategoryValidator),
    defaultValues,
  });

  // useEffect to check for errors
  useEffect(() => {
    if (Object.keys(errors).length) {
      console.log(errors);

      for (const [_key, value] of Object.entries(errors)) {
        toast.error("Something went wrong!", {
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
  }, [errors]);

  //   setting the parent category
  const handleCategory = (e: any) => {
    setParentCategory(e.value);
  };

  //   add image
  const uploadImages = async (
    e: UIEvent & { target: HTMLInputElement & { files: Array<string> } }
  ) => {
    setIsImageLoading(true);
    const files = e.target.files;

    setFile(files[0].name);

    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        const link = await uploadMultipleToS3(file);

        setKey(link);
      }
    }
    setIsImageLoading(false);
  };

  const onSubmit = (data: CategoryCreationRequest) => {
    const payload: CategoryCreationRequest = {
      name: data.name,
      isActive: isActive,
      parentId: parentCategory ? parentCategory : "",
      showOnHome: isOnHome,
      image: key ? key : "",
    };

    createCategory(payload);
  };

  const { mutate: createCategory, isLoading: uploadingData } = useMutation({
    mutationFn: async ({
      isActive,
      name,
      parentId,
      showOnHome,
      image,
    }: CategoryCreationRequest) => {
      const payload: CategoryCreationRequest = {
        isActive,
        name,
        parentId,
        showOnHome,
        image,
        id: category ? category.id : "",
      };

      if (category) {
        const { data } = await axios.put(
          "/api/dashboard/categories/update",
          payload
        );

        return data as string;
      }
      const { data } = await axios.post(
        "/api/dashboard/categories/create",
        payload
      );

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 407) {
          return toast.error("Could not create category.", {
            className:
              "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            style: {
              backgroundColor: "#F07167",
              color: "white",
              fontSize: "16px",
            },
          });
        }
        if (err.response?.status === 411) {
          setIsOnHome(false);
          return toast.error(
            "Already 6 categories are on homepage, cannot add more",
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
        if (err.response?.status === 408) {
          return toast.error("Categrory cannot be a parent of itself.", {
            className:
              "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
            style: {
              backgroundColor: "#F07167",
              color: "white",
              fontSize: "16px",
            },
          });
        }
        if (err.response?.status === 409) {
          return toast.error(
            "The selected parent already has this category as subcategory.",
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
        if (err.response?.status === 412) {
          setIsOnHome(false);
          return toast.error(
            "No image found in this category, So cannot add this category to homepage.",
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
      queryClient.invalidateQueries({
        queryKey: ["dashboardCategories", "limitedCategories"],
      });
      router.push("/dashboard/categories");
      router.refresh();
      if (category)
        return toast.success("Your category has been updated.", {
          className:
            "h-16 box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
          style: {
            backgroundColor: "#13505B",
            color: "white",
            fontSize: "16px",
          },
        });
      return toast.success("New Category has been added", {
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

  let categoryOption: { label: string; value: string }[] = [];
  if (categories) {
    let noParentCategory = categories.filter((cate) => cate.parentId === null);

    categoryOption = noParentCategory?.map((cate) => {
      return { label: cate.name, value: cate.id };
    });

    categoryOption = [
      { label: "No Catgeory", value: "No Category" },
      ...categoryOption,
    ];
  }

  return (
    <div className="flex gap-10 text-white">
      <Card className="flex-1 bg-emboldBlack p-4">
        <CardHeader>
          <div className="">
            <h1 className="text-2xl text-white">Add Category</h1>
            <p className="text-sm text-emboldLight/50">category information</p>
          </div>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className=" flex flex-col gap-10">
              <Input
                {...register("name", { required: true })}
                // defaultValue={OpenedCategory ? OpenedCategory.name : ""}
                className=""
                placeholder="Enter Catgegory Name"
              ></Input>
              {loadingData && (
                <div className="">
                  <Loader2 className="w-4 h-4 animate-spin"></Loader2>
                </div>
              )}

              {categories !== undefined && (
                <Select
                  className="h-16"
                  defaultValue={
                    category?.parent
                      ? {
                          label: category.parent.name,
                          value: category.parentId,
                        }
                      : {
                          label: "No Category",
                          value: "No Category",
                        }
                  }
                  options={categoryOption}
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
                  onChange={handleCategory}
                ></Select>
              )}
              {isImageLoading && (
                <div className="flex items-center gap-2 ">
                  <Loader2 className="w-4 h-4 animate-spin"></Loader2>
                  Image is being uploaded.
                </div>
              )}
              {key && (
                <div className="">
                  <Image
                    src={key}
                    alt="category"
                    width={100}
                    height={100}
                  ></Image>
                </div>
              )}
              <div className="">
                <label className="w-full flex items-center gap-4 px-4 py-2 bg-background  rounded-lg  tracking-wide  cursor-pointer hover:bg-default-200 hover:text-white">
                  <Cloud className="w-8 h-8 "></Cloud>
                  <span className=" text-base leading-normal">
                    {file ? `${file}` : `Upload an image`}
                  </span>
                  <input
                    //   @ts-ignore
                    onChange={uploadImages}
                    type="file"
                    className="hidden"
                  />
                </label>
                <p className="text-xs mt-1 text-white/50">
                  Uplaod image of W-1920 X H-1080 px
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Button variant={"ghost"}>Cancel</Button>
                <div className="flex items-center gap-8">
                  {category && (
                    <DeleteModal
                      name={category.name}
                      id={category.id}
                      path="categories"
                    ></DeleteModal>
                  )}
                  <Button
                    type="submit"
                    isLoading={isImageLoading || uploadingData}
                    variant={"secondary"}
                    className="w-40"
                  >
                    {category ? "Update" : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="flex-[0.5] bg-emboldBlack p-4">
        <CardHeader>
          <div className="">
            <h1 className="text-2xl text-white">Additional Data</h1>
            {/* <p className="text-sm text-emboldLight/50">category information</p> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between bg-background p-4 rounded-lg">
              <label htmlFor="">Publish?</label>
              <Switch
                checked={isActive}
                onClick={() => setIsActive(!isActive)}
                color="secondary"
              ></Switch>
            </div>
            <div className="flex items-center justify-between bg-background p-4 rounded-lg">
              <label htmlFor="">Add to Homepage?</label>
              <Switch
                checked={isOnHome}
                onClick={() => setIsOnHome(!isOnHome)}
                color="secondary"
              ></Switch>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesEditor;
