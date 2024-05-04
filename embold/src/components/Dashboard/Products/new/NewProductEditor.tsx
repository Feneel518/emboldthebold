"use client";

import { Category } from "@/types/Category";
import { Product } from "@/types/Product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { FormProvider, useForm } from "react-hook-form";
import { ProductCreationRequest } from "@/lib/validators/ProductValidator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import Image from "next/image";
import { uploadMultipleToS3 } from "@/lib/s3";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import DeleteModal from "./DeleteModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProductVariants from "./ProductVariants";
import { uuid } from "uuidv4";
import NewProductVariantsTable from "./NewProductVariantsTable";

interface NewProductEditorProps {
  product: Product | null;
}

const NewProductEditor: FC<NewProductEditorProps> = ({ product }) => {
  // router to navigate
  const router = useRouter();

  const queryClient = useQueryClient();

  //   loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //   ///////////////////////////////////////////////////////////////////////////////////////
  //   Categories
  // fetching categories for selection
  const { data: categories, isLoading: loadingData } = useQuery({
    queryKey: ["dashboardCategories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/categories/fetchActive");
      return data.categories as Category[];
    },
  });

  //   state for category
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  //   setting the category
  const handleCategory = (value: { label: string; value: string }[]) => {
    setSelectedCategory(value.map((val) => val.value));
  };
  //   ///////////////////////////////////////////////////////////////////////////////////////

  // // sorting array so that 0 is colour and 1 is size
  useEffect(() => {
    product?.Inventory.map((inv) =>
      inv.AttributesOnInventory.sort((a, b) =>
        a.attributeValue.value > b.attributeValue.value ? -1 : 1
      )
    );
  }, []);

  //   ///////////////////////////////////////////////////////////////////////////////////////
  // getting the size and colour values and storing it in state
  const [colour, setColour] = useState<{ label: string; value: string }[]>();
  const [size, setSize] = useState<string[]>();

  const values = (
    colour: { label: string; value: string }[],
    size: string[]
  ) => {
    useEffect(() => {
      setColour(colour);
      setSize(size);
    }, [colour, size]);
  };
  //   ///////////////////////////////////////////////////////////////////////////////////////

  //   //////////////////////////////////////////////////////////////////////////////////////////////////////
  //   setting the number of subproducts based on size and colour
  let numbeOfSubProducts;
  let results: string[] = [];
  if (colour !== undefined && size) {
    numbeOfSubProducts = colour.length * size.length;
    size.map((size) => {
      colour.map((colo) => {
        results.push(`${colo.value} | ${size}`);
      });
    });
  }

  // bringng the inventory data from variants table
  const [productAttributes, setProductAttributes] = useState<
    {
      price: number;
      discountedPrice: number;
      quantity: number;
      Sku: string;
      subProductName: string;
    }[]
  >([]);

  const inventoryValues = (
    inventory: {
      price: number;
      discountedPrice: number;
      quantity: number;
      Sku: string;
      subProductName: string;
    }[]
  ) => {
    setProductAttributes(inventory);
  };

  //   setting inventorySubproducts
  let inventorySubproducts: {
    price: number;
    discountedPrice: number;
    quantity: number;
    Sku: string;
    subProductName: string;
  }[] = [];

  //   inventorySubproducts if there's no product
  if (product === null) {
    inventorySubproducts = Array.from(Array(numbeOfSubProducts).keys()).map(
      (i, index) => ({
        price: 0,
        discountedPrice: 0,
        quantity: 0,
        Sku: uuid(),
        subProductName: results[index],
      })
    );
  }

  // if product setting the attributed to proper attributes value
  if (product) {
    const attributes: {
      price: number;
      discountedPrice: number;
      quantity: number;
      Sku: string;
      subProductName: string;
    }[] = product.Inventory.map((invent) => {
      const attriValue = `${
        invent.AttributesOnInventory[1].attributeValue.value
      } | ${invent.AttributesOnInventory[0].attributeValue.value}${" "}`;

      return {
        price: invent.price,
        discountedPrice: invent.discountedPrice,
        quantity: invent.Quantity.quantity,
        Sku: invent.Sku,
        subProductName: attriValue,
      };
    });

    const filtered = attributes.filter((ele) => {
      return results.find((el) => {
        return ele.subProductName === el;
      });
    });

    if (results.length === attributes.length) {
      if (filtered.length < attributes.length) {
        const numberOfBlankArraysToAdd = results.length - filtered.length;

        const blankArray = Array.from(
          Array(numberOfBlankArraysToAdd).keys()
        ).map((i, index) => ({
          price: 0,
          discountedPrice: 0,
          quantity: 0,
          Sku: uuid(),
          subProductName: results[index],
        }));
        inventorySubproducts = [...filtered, ...blankArray];
      } else {
        inventorySubproducts = attributes;
      }
    } else if (results.length > filtered.length) {
      const numberOfBlankArraysToAdd = results.length - filtered.length;

      const blankArray = Array.from(Array(numberOfBlankArraysToAdd).keys()).map(
        (i, index) => ({
          price: 0,
          discountedPrice: 0,
          quantity: 0,
          Sku: uuid(),
          subProductName: results[index],
        })
      );
      inventorySubproducts = [...filtered, ...blankArray];
    } else if (attributes.length > filtered.length) {
      inventorySubproducts = attributes.filter((el) => {
        return results.find((ele) => {
          return el.subProductName === ele;
        });
      });
    }
  }

  //   ///////////////////////////////////////////////////////////////////////////////////////
  //   What you see what you get editor
  const ref = initializeWhatYouSeeWhatYouGetEditor(product);
  //   ///////////////////////////////////////////////////////////////////////////////////////

  //   ///////////////////////////////////////////////////////////////////////////////////////
  //   setting the default values
  let defaultValues = {};
  if (product) {
    defaultValues = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      categoryIds: product.categoriesOnProducts
        ? product.categoriesOnProducts.map((cate) => cate.categoryId)
        : [],
      // inventory: productAttributes,
      sizeValues: product.size,
      colourValues: product.colour,
      showOnHome: product.showOnHome,
    };
  } else {
    defaultValues = {
      name: "",
      description: null,
      slug: "",
      categoryIds: [],
      sizeValues: [""],
      colourValues: [{ label: "", value: "" }],
      //   inventory: inventorySubproducts,
      showOnHome: false,
    };
  }
  //   react hook form
  const method = useForm<ProductCreationRequest>({
    defaultValues: defaultValues,
  });

  //   useEffect to check for rect hook form errors
  useEffect(() => {
    if (Object.keys(method.formState.errors).length) {
      for (const [_key, value] of Object.entries(method.formState.errors)) {
        toast.error("Something went wrong.", {
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
  }, [method.formState.errors]);

  //   function to reset the form
  const resetForm = () => {
    method.reset();
    setKey([]);
    // setIsDisabled(false);
    setIsActive(false);
    // setColour([]);
    // setSize([]);
  };
  //   ///////////////////////////////////////////////////////////////////////////////////////

  //   ///////////////////////////////////////////////////////////////////////////////////////
  //   state for setting the images links
  const [key, setKey] = useState<string[]>(
    product?.Image ? product.Image.map((url) => url.url) : []
  );

  //   function to add images to s3
  const uploadImages = async (
    e: UIEvent & { target: HTMLInputElement & { files: Array<string> } }
  ) => {
    const files = e.target.files;
    setIsLoading(true);
    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        const link = await uploadMultipleToS3(file);

        setKey((prev) => [...prev, link]);
      }
      setIsLoading(false);
    }
  };
  // function to remove image
  const handleRemoveImage = (index: number) => {
    setKey((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };
  //   ///////////////////////////////////////////////////////////////////////////////////////

  //   ///////////////////////////////////////////////////////////////////////////////////////
  //   Set the product to active
  const [isActive, setIsActive] = useState<boolean>(
    product ? product.isActive : false
  );

  //  state to showe product on homepage
  const [showOnHome, setShowOnHome] = useState<boolean>(
    product ? product.showOnHome : false
  );

  //   handle fucntion to set active and check its conddition
  const handleShowOnHome = () => {
    if (isActive) {
      setShowOnHome(!showOnHome);
    } else {
      return toast.message(
        "The product should be active to add it to homepage."
      );
    }
  };

  //   ///////////////////////////////////////////////////////////////////////////////////////
  // mutation
  const { mutate: createProduct } = useMutation({
    mutationFn: async ({
      name,
      description,
      categoryIds,
      isActive,
      colourValues,
      sizeValues,
      inventory,
      images,
      showOnHome,
    }: ProductCreationRequest) => {
      const payload: ProductCreationRequest = {
        id: product?.id,
        name,
        description,
        categoryIds,
        isActive,
        colourValues,
        sizeValues,
        inventory,
        images,
        showOnHome,
      };

      if (product) {
        setIsLoading(true);

        const { data } = await axios.put(
          "/api/dashboard/product/update",
          payload
        );

        setIsLoading(false);
      } else if (!product) {
        setIsLoading(true);

        const { data } = await axios.post(
          "/api/dashboard/product/create",
          payload
        );

        setIsLoading(false);
        return data as string;
      }
    },
    onError(err) {
      setIsLoading(false);
      console.log(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboardProducts"],
      });
      router.push("/dashboard/products");
      router.refresh();
      method.reset();

      return toast.success("Your product has been added", {
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

  //   ///////////////////////////////////////////////////////////////////////////////////////
  // On Submit function to call the useMutation

  async function onSubmit(data: any) {
    const blocks = await ref.current?.save();

    const payload: ProductCreationRequest = {
      name: data.name,
      description: blocks,
      categoryIds: selectedCategory,
      isActive: isActive,
      colourValues: colour,
      sizeValues: size,
      inventory: productAttributes,
      images: key,
      showOnHome: showOnHome,
    };

    createProduct(payload);
  }

  return (
    <div className="mt-4 ">
      {/* form */}
      <form className=" grid gap-10" onSubmit={method.handleSubmit(onSubmit)}>
        <FormProvider {...method}>
          {/* main div for right and left cards */}
          <div className="flex flex-col gap-10 lg:flex-row ">
            {/* right card */}
            <div className="flex  flex-col gap-10 lg:w-2/3">
              {/* main info card */}
              <Card className="flex-1 bg-emboldBlack p-4">
                <CardHeader>
                  <CardTitle>Add Product</CardTitle>
                  <CardDescription>Product Information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        {...method.register("name", {
                          required: "name is required",
                        })}
                        className="h-10 "
                        id="name"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div className="flex w-full flex-col space-y-1.5">
                      <Label htmlFor="price">Description</Label>
                      <div
                        className="min-h-[300px] rounded-lg  p-2  bg-background "
                        id="editor"
                      ></div>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Product Category</Label>
                      {product !== null ? (
                        <Select
                          className="text-emboldBlack "
                          defaultValue={
                            product?.categoriesOnProducts
                              ? product?.categoriesOnProducts.map(
                                  (category) => {
                                    return {
                                      label: category.category.name,
                                      value: category.category.id,
                                    };
                                  }
                                )
                              : { label: "", value: "" }
                          }
                          isMulti
                          id="parentCategory"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              border: "1px solid #040404",

                              minHeight: "2.5rem",
                              boxShadow: state.isFocused ? "0" : "0",
                              background: "#1F1F1F",
                              "&:hover": {
                                border: "1px solid #040404)",
                              },
                              color: "#040404",
                            }),
                          }}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary25: "#CDEAEC",
                            },
                          })}
                          options={categories?.map((cate) => {
                            return { label: cate.name, value: cate.id };
                          })}
                          //   @ts-ignore
                          onChange={handleCategory}
                        ></Select>
                      ) : (
                        <Select
                          className="text-emboldBlack "
                          isMulti
                          id="parentCategory"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              border: "1px solid #040404",
                              height: "2.5rem",
                              boxShadow: state.isFocused ? "0" : "0",
                              background: "#1F1F1F",
                              "&:hover": {
                                border: "1px solid #040404)",
                              },
                              color: "#040404",
                            }),
                          }}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary25: "#CDEAEC",
                            },
                          })}
                          options={categories?.map((cate) => {
                            return { label: cate.name, value: cate.id };
                          })}
                          //   @ts-ignore
                          onChange={handleCategory}
                        ></Select>
                      )}
                    </div>

                    <div className="flex w-full flex-col space-y-1.5">
                      {product?.Image && (
                        <Label htmlFor="price">Product Media</Label>
                      )}
                      <div className="grid w-full items-center gap-4">
                        {product && <label htmlFor="">Old images</label>}
                        {product && (
                          <div className="">
                            <div className="flex space-x-4">
                              {product.Image.map((image, index) => {
                                return (
                                  <div className="relative" key={index}>
                                    <Image
                                      src={image.url}
                                      width={100}
                                      height={100}
                                      alt="Image"
                                    ></Image>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {key.length !== 0 && (
                          <label htmlFor="">Change or Delete Images</label>
                        )}

                        <div className="flex space-x-4">
                          {key.map((url, index) => {
                            return (
                              <div key={index} className="relative">
                                <div
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute -right-2 -top-4 cursor-pointer rounded-full bg-embold/70 p-1"
                                >
                                  <X></X>
                                </div>
                                <Image
                                  src={url}
                                  width={100}
                                  height={100}
                                  alt="Image"
                                ></Image>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="image">
                            Product Image (247px X 340px)
                          </Label>
                          <Input
                            id="image"
                            type="file"
                            className="h-10 cursor-pointer "
                            multiple
                            // @ts-ignore
                            onChange={uploadImages}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* variants */}
              <ProductVariants
                product={product!}
                values={values}
              ></ProductVariants>
              <NewProductVariantsTable
                inventorySubproducts={inventorySubproducts}
                results={results}
                inventoryValues={inventoryValues}
                productAttributes={productAttributes}
              ></NewProductVariantsTable>
            </div>
            {/* left card */}
            <div className=" w-[85%] md:w-1/3">
              <Card className="w-full bg-emboldBlack p-4">
                <CardHeader>
                  <CardTitle>Visibility & Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
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
                        checked={showOnHome}
                        onClick={handleShowOnHome}
                        color="secondary"
                      ></Switch>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* ////////////////////////////////////////////////////////////////////////////// */}
          {/* ////////////////////////////////////////////////////////////////////////////// */}
          {/* Footer buttons */}
          <div className="flex w-[85%] justify-between  gap-4 pr-8  md:w-2/3">
            {product ? (
              <Button
                variant="secondary"
                type="reset"
                className="md:w-40"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={() => resetForm()}
                variant="secondary"
                type="reset"
                className="md:w-40"
              >
                Cancel
              </Button>
            )}

            <div className="flex items-center gap-6">
              {product && (
                <DeleteModal id={product.id} name={product.name}></DeleteModal>
              )}
              <Button
                isLoading={isLoading}
                disabled={productAttributes.length === 0}
                variant="default"
                type="submit"
                className={`  md:w-60 ${product && "bg-emboldBlack"}`}
              >
                {product ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </FormProvider>
      </form>
    </div>
  );
};

export default NewProductEditor;

const initializeWhatYouSeeWhatYouGetEditor = (product: Product | null) => {
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Enter the product description",
        inlineToolbar: true,
        data: product ? product.description : { blocks: [] },
        tools: {
          header: Header,
          list: List,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);
  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  return ref;
};
