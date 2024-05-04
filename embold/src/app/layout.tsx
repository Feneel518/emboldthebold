import { Toaster } from "sonner";
import "./globals.css";
import TanstackProviders from "@/components/providers/TanstackProviders";
import Navbar from "@/components/NavigationBar/Navbar";
import Provider from "@/components/providers/Provider";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "Embold",
  description: "Embrace the Bold in You!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-emboldLight/20 text-emboldBlack">
        <Toaster position="top-center" richColors></Toaster>
        <TanstackProviders>
          <Provider>
            <div className="flex flex-col min-h-screen">
              <div className="flex-1">
                <Navbar></Navbar>
                <div className="">{children}</div>
              </div>
              <div className="mt-auto">
                <Footer></Footer>
              </div>
            </div>
          </Provider>
        </TanstackProviders>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}
