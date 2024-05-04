import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="lg:my-24 my-16 ">
      <MaxWidthWrapper>
        <div className="">
          <h1 className="text-2xl text-center">Shipping & Delivery</h1>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>General Policy</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <ol type="1">
                <li>1. All ready to ship items ship within 24-48 hours</li>
                <li>2. We Offer free delivery to all locations in India.</li>
                <li>
                  3. Our warehouse dispatches orders from Monday to Saturday.
                </li>
                <li>
                  4. Once an order is shipped, it takes 3-7 working days to
                  reach you based on your location.
                </li>
                <li>
                  5. Upon dispatch you will receive tracking details via email.
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Shows Delivered but not Received
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <ol type="1">
                <li>
                  1. You are requested to track your package when it shows
                  delivered on your email or sms.
                </li>
                <li>
                  2. As per the recent update in courier companies policies
                  throughout India, you are required to inform us within 3 days
                  if your package isn’t delivered and shows delivered in the
                  tracking for us to help you with the same.
                </li>
                <li>
                  3. The courier company is not accepting any complaints post 72
                  hours marked delivery, and we will not be liable if there is
                  delay in informing from your end.
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Shipping in India</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <ol type="1">
                <li>
                  1. We use premium courier services of BlueDart, DTDC, and
                  Delhivery.
                </li>
                <li>
                  2. Metros: Please allow 2-4 working days for the courier to be
                  delivered post dispatch
                </li>
                <li>
                  3. Non-Metros and Interiors: Please allow 4-5 working days for
                  the courier to be delivered post dispatch.
                </li>
                <li>
                  4. Upon dispatch you will receive tracking details via email
                </li>
                <li>
                  5. We cannot be held accountable for unforeseen weather
                  conditions, custom clearance processes, and courier company
                  caused delay in delivery time. However, we will ensure to keep
                  you well informed incase of any unforeseen delay with your
                  order.
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Colour Difference</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <p>
                The color in images on the website can slightly vary due to
                product shoots in professional lighting.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
