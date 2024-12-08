import { getLatestThreads } from "@/app/util/server/getLatestThreads";
import { Card } from "@/components/ui/card";
import { getTrack } from "@/app/util/server/getTrack";
import Link from "next/link";
import Image from "next/image";

export default async function LatestThreads() {
  try {
    const threads = await getLatestThreads();

    if (!threads || threads.length === 0) {
      return <p>スレッドがありません</p>;
    }

    const threadsWithTracks = await Promise.all(
      threads.map(async (thread) => {
        try {
          const trackData = await getTrack(thread.track_id);
          return { ...thread, trackData };
        } catch (error) {
          console.error(`Error fetching track ${thread.track_id}:`, error);
          return { ...thread, trackData: null };
        }
      })
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {threadsWithTracks.map((thread) => (
          <Card
            key={thread.thread_id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300  mx-auto w-full p-4"
          >
            <Link
              href={`/song/${thread.track_id}/${thread.thread_id}`}
              prefetch={true}
            >
              <div className="space-y-4">
                {/* Thread Title Section */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-muted p-2 rounded-md shrink-0">
                    {thread.emoji}
                  </span>
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {thread.title}
                  </h3>
                </div>
                {thread.trackData && (
                  <div className="flex gap-3 bg-muted/30 p-2 rounded-lg">
                    <div className="w-16 aspect-square relative overflow-hidden rounded-md shrink-0">
                      <Image
                        src={thread.trackData.album.images[0].url}
                        alt={thread.trackData.album.name}
                        fill
                        className="object-cover transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {thread.trackData.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {thread.trackData.artists
                          .map((artist) => artist.name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error in LatestThreads:", error);
    return (
      <p className="text-red-500">
        エラーが発生しました{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }
}
