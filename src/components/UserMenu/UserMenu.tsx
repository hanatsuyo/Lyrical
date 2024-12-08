"use client";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu({ userInfo }: { userInfo: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
          <AvatarFallback className="text-sm font-semibold">
            {userInfo}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 top-16">
        <DropdownMenuItem asChild>
          <Link
            href="/mypage/"
            className="flex items-center gap-1"
            prefetch={true}
          >
            <User size={16} />
            <span>マイページ</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/api/auth/logout" className="flex items-center gap-1">
            <LogOut size={16} />
            <span>ログアウト</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
