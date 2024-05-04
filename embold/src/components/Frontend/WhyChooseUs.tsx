import { FC } from "react";
import curated from "../../../public/Curated Collection.png";
import tailored from "../../../public/Tailored Creations.png";
import empowered from "../../../public/Feel Bold & Empowered.png";
import price from "../../../public/Price-worthy.png";
import solution from "../../../public/One-Stop Complete Solution.png";
import Image from "next/image";

interface WhyChooseUsProps {}

const attributes = [
  {
    id: 1,
    title: "Curated Collection",
    description: "Carefully handpicked designs just for you!",
    image: curated,
  },
  {
    id: 2,
    title: "Tailored Creations",
    description: "Where imagination meets craftsmanship!",
    image: tailored,
  },
  {
    id: 3,
    title: "Feel Bold & Empowered",
    description: "Let's Embrace the bold in you!",
    image: empowered,
  },
  {
    id: 4,
    title: "Price-worthy",
    description: "Worth the spend, for the worthy you!",
    image: price,
  },
  {
    id: 5,
    title: "One-Stop Complete Solution",
    description: "Look, we have more to enhance your overall look!",
    image: solution,
  },
];

const WhyChooseUs: FC<WhyChooseUsProps> = ({}) => {
  return (
    <div className="lg:py-20 pb-10">
      <div className="">
        <h1 className="text-center text-3xl  pb-6">
          Why Choose <strong className="uppercase">Embold</strong> ?
        </h1>
      </div>
      <div className="flex items-center justify-center gap-10 flex-col lg:flex-row">
        {attributes.map((attr) => {
          return (
            <div
              key={attr.id}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-40 h-40 ">
                <Image
                  draggable={false}
                  className="[mix-blend-mode:multiply]"
                  src={attr.image}
                  alt={attr.title}
                  width={300}
                  height={300}
                ></Image>
              </div>
              <div className="flex flex-col items-center justify-center gap- -mt-4">
                <h3 className="text-lg text-center whitespace-nowrap font-semibold">
                  {attr.title}
                </h3>
                <p className="text-center text-black/60">{attr.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyChooseUs;
