"use client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden">
        <Menu className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <div className="flex flex-col gap-4 mt-6">
          <Link
            href="/dashboard/"
            onClick={() => setIsOpen(false)}
            className={buttonVariants({ variant: "ghost" })}
          >
            ダッシュボード
          </Link>
          <Link
            href="/mypage/"
            onClick={() => setIsOpen(false)}
            className={buttonVariants({ variant: "ghost" })}
          >
            マイページ
          </Link>
          <a
            href="/api/auth/logout"
            onClick={() => setIsOpen(false)}
            className={buttonVariants({ variant: "ghost" })}
          >
            ログアウト
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
