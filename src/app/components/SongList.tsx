"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image?: string;
  external_url: string;
}

const TrackCard = ({ track }: { track: Track }) => (
  <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
    <Link href={`/song/${track.id}/`}>
      <div className="aspect-square relative overflow-hidden">
        {track.image ? (
          <img
            src={track.image}
            alt={track.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Music2 className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="line-clamp-1">{track.name}</CardTitle>
        <p className="text-muted-foreground line-clamp-1">{track.artist}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {track.album}
        </p>
      </CardContent>
    </Link>
  </Card>
);

const LoadingSkeleton = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <Skeleton className="aspect-square" />
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    ))}
  </>
);

export default function SongList() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("/api/spotify/top-japan");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Received data:", data);
          throw new Error("Received data is not an array");
        }

        setTracks(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">日本トップ50</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <LoadingSkeleton />
        ) : tracks.length > 0 ? (
          tracks.map((track) => <TrackCard key={track.id} track={track} />)
        ) : (
          <Alert>
            <AlertDescription>曲が見つかりませんでした。</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
