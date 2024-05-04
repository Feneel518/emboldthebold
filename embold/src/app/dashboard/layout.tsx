import DashboardNavigationBar from "@/components/Dashboard/Navigation/DashboardNavigationBar";
import SideBar from "@/components/Dashboard/Navigation/SideBar";
import NotAdmin from "@/components/Helpers/NotAdmin";
import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { getAuthSession } from "@/lib/auth/auth";

export const metadata = {
  title: "Embold - Dashboard",
  description: "A clothing apparel.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Session = await getAuthSession();

  if (!Session?.user.isAdmin)
    return (
      <div className="flex items-center justify-center h-screen text-7xl -mt-10">
        <NotAdmin />
      </div>
    );

  return (
    <div className="min-h-screen embold bg-embold overflow-x-hidden">
      <SideBar></SideBar>
      <div className="py-6">
        <MaxWidthWrapper>
          <DashboardNavigationBar></DashboardNavigationBar>
          {children}
        </MaxWidthWrapper>
      </div>
    </div>
  );
}
