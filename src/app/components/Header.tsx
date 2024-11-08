import { getSession } from "@auth0/nextjs-auth0";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default async function Header() {
  const session = await getSession();

  const NavItems = () => (
    <>
      <Link href="/dashboard/" className={buttonVariants({ variant: "ghost" })}>
        dashboard
      </Link>
      <Link href="/mypage/" className={buttonVariants({ variant: "ghost" })}>
        mypage
      </Link>
      <a
        href="/api/auth/logout"
        className={buttonVariants({ variant: "ghost" })}
      >
        Logout
      </a>
    </>
  );

  return (
    <header className="fixed top-0 left-0 w-full border-b border-slate-200 bg-white z-10">
      <div className="py-3 px-6 flex justify-between items-center">
        <h1 className="text-2xl">リリカル</h1>

        {session ? (
          <>
            {/* デスクトップメニュー */}
            <div className="hidden md:flex items-center gap-3">
              <NavItems />
            </div>

            {/* モバイルメニュー */}
            <Sheet>
              <SheetTrigger className="md:hidden">
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-6">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <a
            href="/api/auth/login?returnTo=/registration/"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </a>
        )}
      </div>
    </header>
  );
}
