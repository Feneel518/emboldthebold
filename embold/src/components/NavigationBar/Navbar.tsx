"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import Logo from "../../../public/blacklogo.png";
import SearchBar from "./SearchBar";
import MaxWidthWrapper from "../Utilities/MaxWidthWrapper";
import NavItems from "./NavItems";
import { useSession } from "next-auth/react";
import { buttonVariants } from "../ui/button";
import Cart from "../Cart/Cart";
import UserAccountNav from "./UserAccountNav";
import { Heart } from "lucide-react";
import MobileMenu from "./MobileMenu";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const pathname = usePathname();

  const { data: Session } = useSession();

  if (pathname?.includes("dashboard")) return null;

  return (
    <div className="sticky z-50 bg-emboldLight50 top-0 inset-x-0 h-16">
      <div className=" flex items-center justify-between lg:px-10 px-2  h-full">
        <div className="">
          <Link href={"/"} className="flex-1">
            <Image
              className="max-lg:w-24"
              alt="Embold Logo"
              src={Logo}
              width={150}
              height={50}
            ></Image>
          </Link>{" "}
        </div>
        {/* laptop thing */}
        <div className="hidden lg:flex lg:items-center">
          <div className="h-full">
            {/* signin link */}
            {Session?.user ? null : (
              <Link
                href={"/sign-in"}
                className={buttonVariants({ variant: "ghost" })}
              >
                Sign in
              </Link>
            )}

            {/* if logged in  then user menu options */}
            {Session?.user ? (
              <UserAccountNav user={Session.user}></UserAccountNav>
            ) : (
              <span className="h-6 w-px bg-black/50" aria-hidden="true"></span>
            )}
          </div>
          {/* create account link */}
          {Session?.user ? (
            <div className=""></div>
          ) : (
            <>
              <div className="flex lg:mx-6">
                <span
                  className="h-6 w-px bg-black/50"
                  aria-hidden="true"
                ></span>
              </div>
              <Link
                href={"/sign-up"}
                className={buttonVariants({ variant: "ghost" })}
              >
                Create account
              </Link>
            </>
          )}

          {Session?.user ? (
            <div className="flex lg:mx-6">
              <span className="h-6 w-px bg-black/50" aria-hidden="true"></span>
            </div>
          ) : (
            <div className="flex lg:mx-6">
              <span className="h-6 w-px bg-black/50" aria-hidden="true"></span>
            </div>
          )}
          <div className="ml-4 flow-root lg:mx-6">
            <SearchBar></SearchBar>
          </div>

          {/* wishlist thing */}
          {Session?.user && (
            <>
              <div className="flex lg:mx-6">
                <span
                  className="h-6 w-px bg-black/50"
                  aria-hidden="true"
                ></span>
              </div>
              <div className="ml-4 flow-root lg:mx-6">
                <Link href={"/wishlist"} className="cursor-pointer">
                  <Heart></Heart>
                </Link>
              </div>
            </>
          )}
          <div className="flex lg:mx-6">
            <span className="h-6 w-px bg-black/50" aria-hidden="true"></span>
          </div>
          <div className="ml-4 flow-root lg:mx-6">
            <Cart></Cart>
          </div>
        </div>

        {/* Mobile thing */}
        <div className="lg:hidden flex items-center gap-8">
          <div className="ml-4 flow-root lg:mx-6">
            <SearchBar></SearchBar>
          </div>
          <MobileMenu Session={Session}></MobileMenu>
        </div>
      </div>
      <div className=" z-50 h-8 lg:h-fit lg:flex lg:self-stretch py-1 text-emboldLight bg-embold ">
        <MaxWidthWrapper>
          <div className="ml-4 lg:flex justify-center lg:ml-0 flex-wrap hidden">
            <NavItems></NavItems>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

export default Navbar;
