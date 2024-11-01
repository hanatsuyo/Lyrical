import Song from "./song";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Form from "./form";

interface PageProps {
  params: {
    trackId: string;
  };
}
export default async function SongDetail({ params }: PageProps) {
  return (
    <>
      <div className="p-8">
        <Song trackId={params.trackId} />
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                スレッド
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>スレッドのタイトルを入力</DialogTitle>
              </DialogHeader>
              <Form trackId={params.trackId} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
