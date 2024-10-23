import Profile from "@/app/components/Profile";
export default function DashBoard() {
  return (
    <div>
      <h1>ダッシュボード</h1>
      <Profile />
      <a href="/api/auth/logout/">Logout</a>
    </div>
  );
}
