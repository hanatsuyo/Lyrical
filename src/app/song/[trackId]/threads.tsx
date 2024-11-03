import type { Thread } from "@/app/types/thread";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Props = {
  threadList: Array<Thread>;
  isLoading: boolean;
};

function ThreadSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6 space-y-2 text-center bg-muted/10">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 mx-auto" />
      </CardContent>
    </Card>
  );
}

export default function Threads({ threadList, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-0 px-2">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <ThreadSkeleton key={index} />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-0 px-2">
      {threadList.map((thread) => (
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
}
