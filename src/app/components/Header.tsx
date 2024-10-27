import UserProfile from "@/app/components/UserProfile";
import { Suspense } from "react";
import { getSession } from "@auth0/nextjs-auth0";
export default async function Header() {
  const session = await getSession();
  return (
    <header className="fixed top-0 left-0 w-full bg-black">
      <div className="py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl text-white">リリカル</h1>

        {session ? (
          <div className="text-white flex items-center gap-3">
            <Suspense fallback={<div className="w-[300px] bg-white h-6"></div>}>
              <UserProfile />
            </Suspense>
          </div>
        ) : (
          <a
            href="/api/auth/login?redirectTo=/registration"
            className="text-white text-lg border border-white px-4 py-1"
          >
            Login
          </a>
        )}
      </div>
    </header>
  );
}
