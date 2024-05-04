import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColourOption, colourOptions } from "@/lib/data/ColourData";
import { FC, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { X } from "lucide-react";
import { Product } from "@/types/Product";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { colours } from "@prisma/client";

interface ProductVariantsProps {
  product: Product | null;
  values: (
    selectedColours: { label: string; value: string }[],
    values1: string[]
  ) => void;
}

const ProductVariants: FC<ProductVariantsProps> = ({ product, values }) => {
  // Colour style for react
  const { data: colour, isLoading } = useQuery({
    queryKey: ["dashboardColour"],
    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/settings/colour/fetch");
      return data.colour as colours[];
    },
  });

  //   selected Colour
  const [selectedColours, setSelectedColours] = useState<
    { label: string; value: string }[]
  >(product ? product.colour : [{ label: "Black", value: "#000000" }]);
  const handleColour = (value: { label: string; value: string }[]) => {
    setSelectedColours(value.map((val) => val));
  };

  //   selected Size
  const [values1, setValues1] = useState<string[]>(product ? product.size : []);
  const addValues1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    if (e.key === " " && e.target.value !== "") {
      setValues1([...values1, e.target.value.toUpperCase()]);
      e.target.value = "";
    }
  };

  const removeValues1 = (indextoRemove: number) => {
    setValues1(values1.filter((_, index) => index !== indextoRemove));
  };
  values(selectedColours, values1);

  const formatOptionLabel = ({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) => (
    <div className="items-center " style={{ display: "flex" }}>
      <div>{label}</div>
      <div
        className="w-5 h-5 rounded-full"
        style={{ marginLeft: "10px", backgroundColor: value }}
      ></div>
    </div>
  );

  return (
    <div>
      <Card className="w-full bg-emboldBlack p-4">
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>
            Add variants like size, colour of the product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-64">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>

                  <Input type="text" value="Size" readOnly></Input>
                </div>
                <div className="w-full">
                  <Label htmlFor="name" className="text-right">
                    Value
                  </Label>
                  <div className="min-h-[35px] h-fit border whitespace-pre-wrap max-md:w-48  border-emboldBlack rounded-md flex gap-2 items-center justify-start p-2 flex-wrap ">
                    {values1 &&
                      values1.map((value, index) => {
                        return (
                          <div
                            key={index}
                            className="bg-embold rounded-lg h-fit p-1 w-fit flex items-center gap-1 text-white"
                          >
                            <h1>{value}</h1>
                            <X
                              onClick={() => removeValues1(index)}
                              className="w-4 cursor-pointer"
                            ></X>
                          </div>
                        );
                      })}
                    <input
                      className={` bg-background h-[35px] pl-2 focus:outline-none max-md:w-40 ${
                        values1.length !== 0 ? "" : "w-full"
                      }`}
                      type="text"
                      placeholder="Press space to add tags"
                      // @ts-ignore
                      onKeyUp={addValues1}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-64">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input type="text" value="Colour" readOnly></Input>
                </div>
                <div className="w-full h-fit">
                  <Label htmlFor="name" className="text-right">
                    Value
                  </Label>
                  <Select
                    className="border-emboldBlack min-h-[35px] max-md:w-48 text-emboldBlack"
                    defaultValue={selectedColours}
                    closeMenuOnSelect={false}
                    isMulti
                    formatOptionLabel={formatOptionLabel}
                    options={colour?.map((cate) => {
                      return { label: cate.label, value: cate.value };
                    })}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        border: "1px solid #040404",
                        minHeight: "3rem",

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
                    // @ts-ignore
                    onChange={handleColour}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductVariants;
