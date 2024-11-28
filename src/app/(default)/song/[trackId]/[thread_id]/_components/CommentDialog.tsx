"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface CommentDialogProps {
  children:
    | React.ReactNode
    | ((props: { setOpen: (open: boolean) => void }) => React.ReactNode);
  threshold?: number; // スクロール量のしきい値（オプション）
}

export default function CommentDialog({
  children,
  threshold = 0.4, // デフォルトは20%スクロールで表示
}: CommentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ダミーの要素を作成して監視
    const target = document.createElement("div");
    target.style.position = "absolute";
    target.style.top = `${threshold * 100}%`;
    document.body.appendChild(target);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 要素が画面外に出たら表示
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      document.body.removeChild(target);
    };
  }, [threshold]);

  // アニメーション用のクラス
  const buttonClass = `fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black grid justify-center items-center hover:scale-125 transition-all duration-300 ease-out
    ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10 pointer-events-none"
    }`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonClass}>
        <Plus className="w-8 h-8 text-white" />
      </DialogTrigger>
      <DialogContent className="top-1/4 w-[90%] bg-white rounded-lg">
        <DialogTitle>コメントを投稿</DialogTitle>
        {typeof children === "function" ? children({ setOpen }) : children}
      </DialogContent>
    </Dialog>
  );
}
