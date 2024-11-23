"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image?: string;
  external_url: string;
}

const TrackCard = ({ track }: { track: Track }) => (
  <div className="flex-[0_0_100%] md:flex-[0_0_320px]">
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
          <CardTitle className="line-clamp-1 leading-normal">
            {track.name}
          </CardTitle>
          <p className="text-muted-foreground line-clamp-1">{track.artist}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {track.album}
          </p>
        </CardContent>
      </Link>
    </Card>
  </div>
);

const LoadingSkeleton = () => (
  <>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex-[0_0_100%] md:flex-[0_0_320px]">
        <Card className="overflow-hidden">
          <Skeleton className="aspect-square" />
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    ))}
  </>
);

export default function SongList() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: false,
    dragFree: true,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

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
    <div className="mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">日本トップ50</h1>
      <div className="relative">
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="flex gap-4">
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

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="lg" onClick={scrollPrev} className="">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={scrollNext} className="">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
