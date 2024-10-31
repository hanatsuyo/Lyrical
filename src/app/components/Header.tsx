import UserProfile from "@/app/components/UserProfile";
import { Suspense } from "react";
import { getSession } from "@auth0/nextjs-auth0";
import { buttonVariants } from "@/components/ui/button";
export default async function Header() {
  const session = await getSession();
  return (
    <header className="fixed top-0 left-0 w-full border-b border-slate-200 bg-white z-10">
      <div className="py-3 px-6 flex justify-between items-center">
        <h1 className="text-2xl">リリカル</h1>

        {session ? (
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="w-[300px] bg-white h-6"></div>}>
              <UserProfile />
            </Suspense>
          </div>
        ) : (
          <a
            href="/api/auth/login?returnTo=/registration/"
            className={buttonVariants({ variant: "outline" })}
          >
            ログイン
          </a>
        )}
      </div>
    </header>
  );
}
