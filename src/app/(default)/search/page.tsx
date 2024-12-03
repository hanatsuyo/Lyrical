"use client";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Music2 } from "lucide-react";
import Link from "next/link";
import { SpotifyTrack } from "@/types/track";
import useSWR from "swr";

export default function SearchPage() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { data } = useSWR<{ tracks: { items: SpotifyTrack[] } }>(
    query ? `/api/spotify/search?q=${query}` : null,
    fetcher
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">検索結果</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.tracks.items.map((track) => (
          <Card
            key={track.id}
            className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Link href={`/song/${track.id}/`}>
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={track.album.images[0]?.url}
                  className="object-cover w-full h-full transition-transform group-hover:scale-110"
                />

                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Music2 className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <CardHeader className="px-4 py-4">
                <CardTitle className="line-clamp-1 leading-normal text-lg">
                  {track.name}
                </CardTitle>
                <p className="text-muted-foreground text-sm  line-clamp-1">
                  {track.artists[0].name}
                </p>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
