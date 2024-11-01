import Song from "@/app/components/Song";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            コメント追加
          </Button>
        </div>
      </div>
    </>
  );
}
