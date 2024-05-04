import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Logo from "../../../../../../public/whiteLogo.png";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="h-screen grainy w-full flex items-center justify-center text-emboldLight50">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 bg-embold rounded-xl space-y-8 w-[500px]">
        <div className="flex items-center justify-center">
          <Link href={"/"}>
            <Image
              alt="Embold Logo"
              src={Logo}
              width={250}
              height={250}
            ></Image>
          </Link>
          <div className="h-[1px] bg-accent/50 mt-2"></div>
        </div>
        <div className="">
          <h1 className="font-semibold text-2xl">Reset password</h1>
          <p className="text-sm text-emboldLight50 font-semibold">
            If the email doesn&apos;t show up, check your spam folder.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Link className="hover:underline flex items-center" href={"/forgot"}>
            <ChevronLeft className="w-4 h-4"></ChevronLeft> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
