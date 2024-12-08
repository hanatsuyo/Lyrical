import { getSession } from "@auth0/nextjs-auth0";
import { buttonVariants } from "@/components/ui/button";
import UserSheet from "./UserMenu/User";
import Search from "./Search";
import Link from "next/link";

export default async function Header({
  showMenu = true,
}: {
  showMenu?: boolean;
}) {
  const session = await getSession();

  return (
    <header className="fixed top-0 left-0 w-full border-b border-slate-200 bg-white z-10">
      <div className="py-3 px-4 md:px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl shrink-0">
          <Link href={session ? "/dashboard" : "/"} prefetch={true}>
            リリカル
          </Link>
        </h1>

        {showMenu && (
          <>
            {session ? (
              <>
                <div className="flex gap-2">
                  <Search />
                  <UserSheet />
                </div>
              </>
            ) : (
              <a
                href="/api/auth/login?returnTo=/registration/"
                className={buttonVariants({ variant: "outline" })}
              >
                ログイン
              </a>
            )}
          </>
        )}
      </div>
    </header>
  );
}
