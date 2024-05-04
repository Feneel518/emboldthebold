"use client";

import { Dispatch, FC, SetStateAction } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Category } from "@/types/Category";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface MobileCategoriesProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileCategories: FC<MobileCategoriesProps> = ({ setOpen }) => {
  const { data: categories, isLoading: loadingData } = useQuery({
    queryKey: ["NavbarCategories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/categories/fetchNavbar");
      return data.categories as Category[];
    },
  });

  if (loadingData)
    return (
      <div className="flex justify-center items-center w-full gap-2">
        <Loader2 className="animate-spin w-4 h-4"></Loader2> Loading...
      </div>
    );

  if (!categories) return null;
  return (
    <Accordion type="single" collapsible className="w-fit flex flex-col gap-2 ">
      <div className="text-embold text-sm underline">Categories</div>
      {categories.map((cate, index) => {
        return (
          !cate.parentId &&
          (cate.subCategory?.length !== 0 ? (
            <div className="">
              <AccordionItem value={cate.name} className="border-0 ">
                <AccordionTrigger className="py-0 font-normal">
                  {cate.name}
                </AccordionTrigger>
                <AccordionContent>
                  {cate.subCategory?.map((sub) => {
                    return (
                      <div className="">
                        <Link
                          onClick={() => setOpen(false)}
                          href={`/category/${cate.slug}?sub=${sub.slug}`}
                        >
                          {sub.name}
                        </Link>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </div>
          ) : (
            <Link
              onClick={() => setOpen(false)}
              href={`/category/${cate.slug}`}
            >
              {cate.name}
            </Link>
          ))
        );
      })}
    </Accordion>
  );
};

export default MobileCategories;
