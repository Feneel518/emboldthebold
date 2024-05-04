import MaxWidthWrapper from "@/components/Utilities/MaxWidthWrapper";
import { FC } from "react";
import AboutUsImage from "../../../../../public/about.jpg";
import Image from "next/image";
interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = ({}) => {
  return (
    <MaxWidthWrapper className=" mt-8 lg:mt-16 ">
      <div className="hidden lg:block">
        <div className="flex ">
          <div className="bg-emboldLight w-[500px] min-w-[500px] h-[700px]">
            <Image
              src={AboutUsImage}
              alt="About us image"
              width={1920}
              height={1920}
              className="w-full h-full object-cover object-right"
            ></Image>
          </div>
          <div className="">
            <div className="flex gap-20">
              <h1 className="text-9xl font-thin -ml-8">
                Who <br /> We <br /> Are.
              </h1>
              <div className="bg-emboldLight shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] h-fit p-10 rounded-xl text-5xl mt-24 text-center font-extralight">
                EMBOLD
                <div className="lg:text-3xl text-2xl">
                  &quot;Embrace the Bold in You!&quot;
                </div>
                <div className="mt-4">
                  <h5 className="text-lg">
                    Embold was born in 2022 with an idea of being a brand for
                    YOU! <br className="mt-2" />
                    <span className="font-bold">&quot;YOU&quot;</span> - who is
                    reading this, who loves their body and wants to embrace it
                    with a pinch of classy boldness. Embold wants to give that
                    freedom and strength of style to every such individual in
                    their journey to embrace themselves and their confidence in
                    every field of life.
                  </h5>
                </div>
                <div className="mt-4">
                  <h5 className="text-lg">
                    Founded by Apurva Taneja and Aditya Taneja, Embold emerged
                    from a shared vision of infusing innovation and creativity
                    into the fashion industry. Apurva, with a strong tech
                    background in the IT industry and a lifelong inclination
                    towards fashion, partnered with Aditya, who brings extensive
                    experience from the fashion realm, creating a unique blend
                    that defines Embold
                  </h5>
                </div>
              </div>
            </div>
            <div className="my-8 text-lg font-extralight -ml-32 rounded-xl shadow-xl p-10 z-50 bg-white/40 ">
              Embrace the power of bold choices without breaking the bank. Your
              style journey with Embold is not just about garments; it's about
              making a statement, embracing your authenticity, and stepping into
              a world of fashion where being fearless is the ultimate trend.{" "}
              <div className="mt-4">
                Join us as we redefine affordable fashion with a commitment to
                quality. Embold invites you to be bold, be confident while
                having fun and most importantly, be YOU. Your journey to
                confident styling starts here.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" lg:hidden">
        <div className="text-center text-6xl font-thin  z-10 mb-4">
          Who are we.
        </div>
        <div className="bg-emboldLight w-[300px] min-w-[300px]  h-[400px] mx-auto ">
          <Image
            src={AboutUsImage}
            alt="About us image"
            width={1920}
            height={1920}
            className="w-full h-full object-cover object-right"
          ></Image>
        </div>

        <div className="mt-4 mb-10 text-xl font-extralight  rounded-xl shadow-xl p-10 z-50 bg-white/40 text-justify">
          <h1 className="text-5xl text-center">EMBOLD</h1>
          <div className="lg:text-3xl whitespace-nowrap mb-6 max-lg:text-center">
            {" "}
            &quot;Embrace the Bold in You!&quot;
          </div>
          <h5 className=" ">
            Embold was born in 2022 with an idea of being a brand for YOU!{" "}
          </h5>
          <div className="mt-4">
            Founded by Apurva Taneja and Aditya Taneja, Embold emerged from a
            shared vision of infusing innovation and creativity into the fashion
            industry. Apurva, with a strong tech background in the IT industry
            and a lifelong inclination towards fashion, partnered with Aditya,
            who brings extensive experience from the fashion realm, creating a
            unique blend that defines Embold
          </div>
          <div className="mt-4">
            <span className="font-bold mt-4">&quot;YOU&quot;</span> - who is
            reading this, who loves their body and wants to embrace it with a
            pinch of classy boldness. Embold wants to give that freedom and
            strength of style to every such individual in their journey to
            embrace themselves and their confidence in every field of life.
          </div>
          <div className="mt-4">
            Embrace the power of bold choices without breaking the bank. Your
            style journey with Embold is not just about garments; it's about
            making a statement, embracing your authenticity, and stepping into a
            world of fashion where being fearless is the ultimate trend.{" "}
          </div>
          <div className="mt-4">
            Join us as we redefine affordable fashion with a commitment to
            quality. Embold invites you to be bold, be confident while having
            fun and most importantly, be YOU. Your journey to confident styling
            starts here.
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
