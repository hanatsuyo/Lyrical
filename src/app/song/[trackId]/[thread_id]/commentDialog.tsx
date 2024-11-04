"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

// childrenの型を修正
interface CommentDialogProps {
  children:
    | React.ReactNode
    | ((props: { setOpen: (open: boolean) => void }) => React.ReactNode);
}

export default function CommentDialog({ children }: CommentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black grid justify-center items-center hover:scale-125 transition-all duration-300 ease-out">
        <Plus className="w-8 h-8 text-white" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>コメントを投稿</DialogTitle>
        {typeof children === "function" ? children({ setOpen }) : children}
      </DialogContent>
    </Dialog>
  );
}
