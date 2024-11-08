import Information from "./Information";
import { checkRegistration } from "@/app/util/checkRegistration";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";
import Threads from "./threads";
export default async function Mypage() {
  const session = await getSession();
  if (!session) throw new Error("ログインしてください");
  const existingUser = await checkRegistration(session.user.email);
  if (!existingUser) redirect("/registration");

  return (
    <>
      <Information />
      <Threads />
    </>
  );
}