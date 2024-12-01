import Information from "./_sections/Information";
import { checkRegistration } from "@/app/util/client/checkRegistration";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";
import Threads from "./_sections/Threads";
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
