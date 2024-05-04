import { FC } from "react";

import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { Separator } from "@/components/ui/separator";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="lg:my-24 my-16 ">
      <MaxWidthWrapper>
        <div className="">
          <h1 className="text-2xl text-center">Return And Exhange</h1>
        </div>
        <div className="my-4 text-sm">
          <p>Thanks for shopping with Embold</p>
          <p className="mt-2">
            While we believe in selling premium quality and providing the best
            fit for all our products, we understand that quality and fit are
            personal to individuals and not everyone prefers the same fabrics
            and fit. Hence at Embold, we support product Return/Exchanges.
            Please follow the below process for the same.
          </p>
        </div>
        <Separator></Separator>
        <ol className="list-decimal p-10 space-y-2">
          <li>
            If your item(s) has all tags and labels attached, remains unworn,
            unwashed, unsoiled and is within 7 days of receiving the product,
            you can place a Return/Exchange request by sending an email to
            embold.helpdesk@gmail.com with your request.
          </li>
          <li>
            Our team will get in touch with you and raise the required request
            internally.
          </li>
          <li>
            Once we receive your return item(s), our backend team will inspect
            it for damages with no anomalies
          </li>
          <li>
            To be eligible for Return/Exchange, your item must be unused, and in
            the same condition in which you received it.
          </li>
          <li>
            Your item must be in its original packaging. Your item must also
            have the tags, receipt or proof of purchase. In case you receive a
            damaged item, please make sure you have a seal opening video showing
            the receiving of the damaged product
          </li>
          <li>
            In case of Return, our CRM team will automatically process the
            amount to you and will send you a notification to confirm the same.
          </li>
          <li>
            In the case of Exchange, once your refund is successful, you can
            place the new order as per availability.
          </li>
        </ol>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
