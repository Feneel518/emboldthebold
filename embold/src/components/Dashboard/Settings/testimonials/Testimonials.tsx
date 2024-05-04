"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { uploadMultipleToS3 } from "@/lib/s3";
import {
  TestimonialCreationRequest,
  TestimonialDeleteRequest,
  TestimonialValidator,
} from "@/lib/validators/Testimonials";
import { zodResolver } from "@hookform/resolvers/zod";
import { Testimonial } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface TestimonialsProps {}

const Testimonials: FC<TestimonialsProps> = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await axios.get("/api/testimonials/fetch");
      return data.testimonials as {
        id: string;
        name: string;
        comment: string;
        image: string;
      }[];
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TestimonialCreationRequest>({
    resolver: zodResolver(TestimonialValidator),
    defaultValues: {
      name: "",
      comment: "",
      image: "",
    },
  });

  // useEffect to check for errors
  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast.error(
          `Something went wrong. Error: ${
            (value as { message: string }).message
          }`,
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
  }, [errors]);

  const { mutate: createTesti } = useMutation({
    mutationFn: async ({
      name,
      comment,
      image,
    }: TestimonialCreationRequest) => {
      const payload: TestimonialCreationRequest = {
        name,
        comment,
        image,
      };

      const { data } = await axios.post(
        "/api/dashboard/testimonial/create",
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
        "Something went wrong, Your testimonoial was not created. Please try again.",
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
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });

      router.refresh();

      return toast.success("New testimonial has been added", {
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

  const handleBanner = async (data: TestimonialCreationRequest) => {
    if (key) {
      const payload: TestimonialCreationRequest = {
        image: key,
        comment: data.comment,
        name: data.name,
      };
      createTesti(payload);
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

  const { mutate: deleteTesti } = useMutation({
    mutationFn: async ({ id }: TestimonialDeleteRequest) => {
      const payload: TestimonialDeleteRequest = {
        id,
      };

      const { data } = await axios.post(
        "/api/dashboard/testimonial/delete",
        payload
      );

      return data as string;
    },
    // if error
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 407) {
          return toast.error(
            "Could not update banner, please try again later",
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
      return toast.error(
        "Something went wrong,  Your testimonial was not deleted. Please try again.",
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
      router.refresh();

      reset();

      return toast.success("New testimonial has been deleted", {
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

  const handleDelete = (id: string) => {
    const payload: TestimonialDeleteRequest = { id };

    deleteTesti(payload);
  };
  return (
    <div className="p-4 ">
      <div className="mb-4">
        <h1 className="text-xl mb-1">Testimonials</h1>
        <Separator></Separator>
      </div>
      <form
        action=""
        className="flex flex-col gap-8"
        // @ts-ignore
        onSubmit={handleSubmit((data, e) => handleBanner(data, e))}
      >
        <div className="">
          <Input
            placeholder="Name"
            {...register("name", { required: "Name is requiured" })}
          ></Input>
        </div>
        <div className="">
          <Label>Comment</Label>
          <Textarea
            {...register("comment", { required: "Comment is requiured" })}
            placeholder="Type your message here."
            className="h-full"
          />
        </div>
        <div className="">
          <Label>Image</Label>
          <Input // @ts-ignore
            onChange={uploadImages}
            className="h-10"
            type="file"
          ></Input>
        </div>
        <Button className="w-40" isLoading={isloading} variant="outline">
          Submit
        </Button>
      </form>
      <Separator className="my-10"></Separator>

      {testimonials?.length !== 0 && (
        <div className="">
          <div className="mb-4">
            <h1 className="text-xl mb-1">Lists</h1>
            <Separator></Separator>
          </div>
          <div className="flex flex-col gap-5">
            {testimonials?.map((testi) => {
              return (
                <>
                  <div className="bg-background p-2 rounded-md">
                    <div className="flex justify-between  items-center gap-4">
                      <div className="flex gap-4">
                        <div className="">{testi.name}</div>
                        <div className=" line-clamp-2">{testi.comment}</div>
                      </div>
                      <div
                        onClick={() => handleDelete(testi.id)}
                        className="cursor-pointer hover:bg-red-300 p-2 hover:text-emboldBlack rounded-md"
                      >
                        <Trash className=""></Trash>
                      </div>
                    </div>
                  </div>
                  <div className="mx-auto  w-96 h-0.5 bg-emboldLight/30"></div>
                </>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
