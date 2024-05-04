import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC, useCallback, useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { uuid } from "uuidv4";

interface NewProductVariantsTableProps {
  results: string[];
  inventorySubproducts: {
    price: number;
    discountedPrice: number;
    quantity: number;
    Sku: string;
    subProductName: string;
  }[];
  productAttributes: {
    price: number;
    discountedPrice: number;
    quantity: number;
    Sku: string;
    subProductName: string;
  }[];
  inventoryValues: (
    inventory: {
      price: number;
      discountedPrice: number;
      quantity: number;
      Sku: string;
      subProductName: string;
    }[]
  ) => void;
}

const NewProductVariantsTable: FC<NewProductVariantsTableProps> = ({
  results,
  inventorySubproducts,
  inventoryValues,
  productAttributes,
}) => {
  const [inventory, setInventory] = useState(
    productAttributes.length > 0 ? productAttributes : inventorySubproducts
  );

  useEffect(() => {
    setInventory(
      productAttributes.length > 0 ? productAttributes : inventorySubproducts
    );
  }, [inventorySubproducts, productAttributes]);

  const addValues = (Sku: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const index = inventory.findIndex((sk) => sk.Sku === Sku);

    let _inventory = [...inventory] as any;

    _inventory[index][e.target.name] = Number(e.target.value);

    setInventory(_inventory);
  };

  const handleSubmit = () => {
    inventoryValues(inventory);
  };

  const handleSetValue = () => {
    const price = inventory[0].price;
    const discountedPrice = inventory[0].discountedPrice;
    const quantity = inventory[0].quantity;

    const abc = inventory.map((invent) => {
      (invent.price = price),
        (invent.discountedPrice = discountedPrice),
        (invent.quantity = quantity);

      return invent;
    });

    setInventory(abc);
  };

  return (
    <Card className="w-full bg-emboldBlack p-4">
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
        <CardDescription>
          Add variants like size, colour of the product.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inventory.map((invent, index) => {
          return (
            <div key={invent.Sku} className="grid grid-cols-4 gap-4">
              <div className="flex flex-col space-y-1.5 ">
                <Label>Variants</Label>
                <Input
                  placeholder="a"
                  name="subProdName"
                  value={results[index]}
                  readOnly
                ></Input>
              </div>
              <div className="flex flex-col space-y-1.5 ">
                <Label>Price</Label>
                <Input
                  placeholder="b"
                  name="price"
                  type="number"
                  min={0}
                  value={inventory[index].price}
                  onChange={(e) => addValues(invent.Sku, e)}
                ></Input>
              </div>
              <div className="flex flex-col space-y-1.5 ">
                <Label>Discounted Price</Label>
                <Input
                  name="discountedPrice"
                  type="number"
                  placeholder="c"
                  min={0}
                  value={inventory[index].discountedPrice}
                  onChange={(e) => addValues(invent.Sku, e)}
                ></Input>
              </div>
              <div className="flex flex-col space-y-1.5 ">
                <Label>Quantity</Label>
                <Input
                  name="quantity"
                  type="number"
                  placeholder="d"
                  min={0}
                  value={inventory[index].quantity}
                  onChange={(e) => addValues(invent.Sku, e)}
                ></Input>
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="w-full flex justify-between flex-row-reverse">
        <div className="">
          <Button
            type="button"
            variant={"secondary"}
            onClick={handleSubmit}
            className="w-60"
          >
            Save details
          </Button>
          <p className="text-xs text-center">
            It must be clicked to save the above values
          </p>
        </div>

        <div className="">
          <Button
            type="button"
            variant={"secondary"}
            onClick={handleSetValue}
            className="w-60"
          >
            Fill Value
          </Button>
          <p className="text-xs">
            Fill all the values, with the value in the first row.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewProductVariantsTable;
