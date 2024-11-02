import Song from "./song";
import CategoryTab from "./categoryTab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
              <Form trackId={params.trackId} />
            </DialogContent>
          </Dialog>
          <div className="mt-8">
            <CategoryTab />
          </div>
        </div>
      </div>
    </>
  );
}
