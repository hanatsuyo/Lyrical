"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image?: string;
  external_url: string;
}

const TrackCard = ({ track }: { track: Track }) => (
  <div className="max-w-full flex-[0_0_200px]">
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
        <CardHeader className="px-2 py-2">
          <CardTitle className="line-clamp-1 leading-normal text-lg">
            {track.name}
          </CardTitle>
          <p className="text-muted-foreground text-sm  line-clamp-1">
            {track.artist}
          </p>
        </CardHeader>
      </Link>
    </Card>
  </div>
);

const LoadingSkeleton = () => (
  <>
    {[...Array(20)].map((_, i) => (
      <div key={i} className="flex-[0_0_100%] flex-[0_0_200px]">
        <Card className="overflow-hidden">
          <Skeleton className="aspect-square" />
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
        </Card>
      </div>
    ))}
  </>
);

export default function SongList({ api }: { api: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: false,
    dragFree: true,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const { data: tracks, error, isLoading } = useSWR<Track[]>(api, fetcher);
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
    <div className="relative">
      <div className="cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : tracks?.length ? (
            tracks.map((track) => <TrackCard key={track.id} track={track} />)
          ) : (
            <Alert>
              <AlertDescription>曲が見つかりませんでした。</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={scrollPrev}
          className="h-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={scrollNext}
          className="h-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
