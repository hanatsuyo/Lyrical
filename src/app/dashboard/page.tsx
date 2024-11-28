import SongList from "@/app/components/SongList";
import { checkRegistration } from "@/app/util/client/checkRegistration";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";
import LatestThreads from "./LatestThreads";
export default async function DashBoard() {
  const session = await getSession();
  if (!session) throw new Error("ログインしてください");
  const existingUser = await checkRegistration(session.user.email);
  if (!existingUser) redirect("/registration");
  return (
    <div className="flex flex-col gap-10 py-6 ">
      <div>
        <h2 className="font-bold text-3xl">最新のスレッド</h2>
        <div className="mt-4">
          <LatestThreads />
        </div>
      </div>
      <div>
        <h2 className="font-bold text-3xl">日本で人気の曲</h2>
        <div className="mt-4">
          <SongList api="/api/spotify/top-japan" />
        </div>
      </div>
      <div>
        <h2 className="font-bold text-3xl">ビルボードランキング</h2>
        <div className="mt-4">
          <SongList api="/api/spotify/top-global" />
        </div>
      </div>
    </div>
  );
}
