import Information from "./_components/Information";
import { checkRegistration } from "@/app/util/client/checkRegistration";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";
import Threads from "./_components/Threads";
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
