import DeleteNewsLetter from "@/components/Dashboard/Settings/NewsLetter/DeleteNewsLetter";
import ExportCSV from "@/components/Dashboard/Settings/NewsLetter/ExportCSV";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

const page: FC<pageProps> = async ({}) => {
  const subscribers = await db.newsLetter.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h1 className="mb-1 text-xl">Subscribers</h1>
        </div>
        {/* @ts-ignore */}
        <ExportCSV data={subscribers}></ExportCSV>
      </div>
      <Separator></Separator>

      <div className="mt-4">
        {subscribers.length !== 0 && (
          <div className=" flex flex-col items-start gap-4 w-full">
            {subscribers.map((subs) => {
              const currentDate = new Date(
                subs.createdAt.toLocaleString("en-US", {
                  timeZone: "Asia/Calcutta",
                })
              );

              return (
                <div className="grid grid-cols-4 w-full">
                  <div className="">{subs.email}</div>
                  <div className="">{subs.createdAt?.toDateString()}</div>
                  <div className="">{currentDate.toLocaleTimeString()}</div>
                  <div className="flex justify-end w-full">
                    <DeleteNewsLetter id={subs.id}></DeleteNewsLetter>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
