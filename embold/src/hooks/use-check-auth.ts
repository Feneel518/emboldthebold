import { getAuthSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export async function CheckAuth() {
  const Session = await getAuthSession();

  if (!Session?.user) {
    redirect("/");
  }

  return Session;
}
