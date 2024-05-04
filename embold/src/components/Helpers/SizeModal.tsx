import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Image from "next/image";
import Size from "../../../public/size.jpg";

interface SizeModalProps {}

const SizeModal: FC<SizeModalProps> = ({}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="text-md cursor-pointer font-semibold text-black/[0.5]">
          Size Chart
        </div>
      </DialogTrigger>
      <DialogContent className="bg-emboldLight50 ">
        <DialogHeader></DialogHeader>
        <div className="y-4  ">
          <div className="w-full">
            {/* content */}
            <Image
              src={Size}
              alt="size guide"
              width={1920}
              height={1080}
            ></Image>
          </div>
        </div>
        <DialogFooter className="flex justify-center">
          <DialogPrimitive.Close
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            Cancel
            {/* <Button type="button">Cancel</Button> */}
          </DialogPrimitive.Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SizeModal;
