import { getSession } from "@auth0/nextjs-auth0";
import { buttonVariants } from "@/components/ui/button";
import Search from "./Search";
import Hamburger from "./Hamburger";
import Link from "next/link";

export default async function Header({
  showMenu = true,
}: {
  showMenu?: boolean;
}) {
  const session = await getSession();

  const NavItems = () => (
    <>
      <Search />
      <Link href="/mypage/" className={buttonVariants({ variant: "default" })}>
        マイページ
      </Link>
      {/* <a
        href="/api/auth/logout"
        className={buttonVariants({ variant: "outline" })}
      >
        ログアウト
      </a> */}
    </>
  );

  return (
    <header className="fixed top-0 left-0 w-full border-b border-slate-200 bg-white z-10">
      <div className="py-3 px-4 md:px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl">
          <Link href={session ? "/dashboard" : "/"}>リリカル</Link>
        </h1>

        {showMenu && (
          <>
            {session ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <NavItems />
                </div>
                <div className="flex gap-2 md:hidden">
                  <Search />
                  <Hamburger />
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
