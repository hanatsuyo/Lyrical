import { getLatestThreads } from "@/app/util/server/getLatestThreads";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
export default async function LatestThreads() {
  try {
    const threads = await getLatestThreads();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {threads.map((thread) => (
          <Card
            key={thread.thread_id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/song/${thread.track_id}/${thread.thread_id}`}>
              <CardHeader className="grid justify-center bg-muted/10">
                <span className="text-4xl">{thread.emoji}</span>
              </CardHeader>
              <CardContent className="mt-2">
                <h3 className="text-lg font-semibold text-center truncate">
                  {thread.title}
                </h3>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <>
        <p className="text-red-500">
          エラーが発生しました{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </>
    );
  }
}
