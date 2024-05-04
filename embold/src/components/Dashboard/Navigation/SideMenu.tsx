import { FC } from "react";
import SideLinks from "./SideLinks";
import { motion } from "framer-motion";
import Curve from "./Curve";
import Image from "next/image";
import Logo from "../../../../public/whiteLogo.png";
import Link from "next/link";
interface SideMenuProps {}

const SideMenu: FC<SideMenuProps> = ({}) => {
  const sidebarSlide = {
    initial: {
      x: "calc(-100% - 100px)",
    },
    enter: {
      x: "0%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      x: "calc(-100% - 100px)",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Products",
      href: "/dashboard/products",
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
    },

    {
      title: "Inventory",
      href: "/dashboard/inventory",
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
    },
    {
      title: "Settings",
      href: "/dashboard/settings/homepage",
    },
  ];
  return (
    <motion.div
      variants={sidebarSlide}
      animate="enter"
      exit="exit"
      initial="initial"
      className="fixed -z-20 left-0 top-0 h-screen bg-emboldBlack text-white"
    >
      <div className="box-border h-full p-[100px] flex flex-col justify-center gap-8">
        <Link href={"/"} className="">
          <Image src={Logo} alt="embold-logo" width={200} height={200}></Image>
        </Link>
        <div className=" flex flex-col text-[48px] gap-2 -mt-[10px] max-sm:mt-16">
          <div className="header text-gray-300  border-b border-gray-300 uppercase text-[11px] mb-5">
            <p>Navigation</p>
          </div>
          {navItems.map((item, index) => {
            return <SideLinks key={index} data={{ ...item, index }} />;
          })}
        </div>
      </div>
      <Curve></Curve>
    </motion.div>
  );
};

export default SideMenu;
