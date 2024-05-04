"use client";

import "@/app/globals.css";
import { Inter } from "next/font/google";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    {
      name: "Home Page",
      link: "/dashboard/settings/homepage",
      active: "homepage",
    },
    {
      name: "Banner",
      link: "/dashboard/settings/banner",
      active: "banner",
    },
    {
      name: "Testimonials",
      link: "/dashboard/settings/testimonials",
      active: "testimonials",
    },
    {
      name: "News Letter Subsciptions",
      link: "/dashboard/settings/newsletter",
      active: "newsletter",
    },
    {
      name: "Admin Authorization",
      link: "/dashboard/settings/admin",
      active: "admin",
    },
    {
      name: "Colours",
      link: "/dashboard/settings/colours",
      active: "colours",
    },
  ];
  return (
    <div className="flex max-sm:flex-col gap-8">
      <div className="  h-full w-80 max-sm:w-full rounded-xl bg-emboldBlack p-4 text-emboldLight">
        <div className="mb-2">Sub-Menu</div>
        <Separator></Separator>
        <div className="mt-6 flex flex-col gap-4">
          {links.map((link) => {
            return (
              <Link
                href={link.link}
                className={`cursor-pointer hover:bg-background p-2 rounded-md  ${
                  pathname?.includes(link.active) &&
                  "bg-background  border-secondary border-r-2"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="h-full flex-1 rounded-xl bg-emboldBlack p-4 text-emboldLight">
        {children}
      </div>
    </div>
  );
}
