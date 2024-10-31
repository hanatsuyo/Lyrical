import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import SongList from "@/app/components/SongList";
export default async function DashBoard() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login?returnTo=/registration");
  }
  return (
    <div>
      <SongList />
    </div>
  );
}
