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
    <div className="grid gap-10 py-6 ">
      <div>
        <h2 className="font-bold text-3xl">日本トップ50</h2>
        <div className="mt-4">
          <SongList api="/api/spotify/top-japan" />
        </div>
      </div>
      <div>
        <h2 className="font-bold text-3xl">世界トップ50</h2>
        <div className="mt-4">
          <SongList api="/api/spotify/top-global" />
        </div>
      </div>
    </div>
  );
}
