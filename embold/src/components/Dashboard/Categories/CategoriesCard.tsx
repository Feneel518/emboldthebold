import { Category } from "@/types/Category";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FC } from "react";
import { Badge } from "@/components/ui/badge";

interface CategoriesCardProps {
  image?: string;
  name: string;
  showOnHome: boolean;
  isActive: boolean;
  parentId?: string;
  slug: string;
  subCategory?: Category[];
}

const CategoriesCard: FC<CategoriesCardProps> = ({
  image,
  name,
  showOnHome,
  isActive,
  parentId,
  slug,
  subCategory,
}) => {
  return (
    <Card className="max-lg:w-[95%]">
      <CardContent className="">
        <div className="flex lg:gap-8 gap-2 ">
          <div className=" w-1/3">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={150}
                height={200}
                className="lg:w-[150px] lg:h-[200px] w-24 h-28 object-cover rounded-lg"
              ></Image>
            ) : (
              <div className="lg:text-9xl text-5xl lg:min-h-[200px] lg:min-w-[150px]  w-24 h-28 flex items-center justify-center border border-white/50 rounded-lg">
                {name[0]}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between gap-8 w-1/2">
            <div className="flex flex-col gap-2">
              <h1 className="lg:text-3xl text-xl">{name}</h1>
              {subCategory?.length !== 0 && (
                <div className="">
                  <p className="lg:text-sm text-xs  text-emboldLight/70">
                    It is a parent Category, it&apos;s subcategories are
                  </p>
                  <div className="flex gap-1 flex-col mt-2">
                    {subCategory?.map((sub, index) => {
                      return (
                        <p
                          key={index}
                          className="lg:text-sm text-xs text-emboldLight/70 whitespace-pre-line"
                        >
                          {index + 1 === subCategory.length
                            ? subCategory.length !== 1
                              ? `and ${sub.name}`
                              : `${sub.name}`
                            : `${sub.name},`}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              {showOnHome && (
                <Badge className="whitespace-nowrap" variant={"success"}>
                  Home Page
                </Badge>
              )}
              <div className="">
                {isActive ? (
                  <Badge variant={"success"}>Active</Badge>
                ) : (
                  <Badge variant={"destructive"}>Draft</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesCard;
