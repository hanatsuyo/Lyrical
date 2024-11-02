"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Form from "./form";

export default function FormDialog({ trackId }: { trackId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            スレッド
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle aria-hidden="true" className="hidden">
            スレッドの情報を入力してください
          </DialogTitle>
          <Form trackId={trackId} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
