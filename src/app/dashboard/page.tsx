import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
export default async function DashBoard() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login?returnTo=/registration");
  }
  return (
    <div>
      <h1>ダッシュボード</h1>
    </div>
  );
}
