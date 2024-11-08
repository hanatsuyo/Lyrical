import SongList from "@/app/components/SongList";
import { checkRegistration } from "@/app/util/checkRegistration";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";
export default async function DashBoard() {
  const session = await getSession();
  if (!session) throw new Error("ログインしてください");
  const existingUser = await checkRegistration(session.user.email);
  if (!existingUser) redirect("/registration");
  return (
    <div>
      <SongList />
    </div>
  );
}
