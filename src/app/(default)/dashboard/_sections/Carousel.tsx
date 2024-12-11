"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Music2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      <Link href={`/song/${track.id}/`} prefetch={true}>
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
          <p className="text-muted-foreground text-sm line-clamp-1">
            {track.artist}
          </p>
        </CardHeader>
      </Link>
    </Card>
  </div>
);

const ErrorDisplay = () => (
  <Alert variant="destructive" className="my-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      トラック情報の取得に失敗しました。時間をおいて再度お試しください。
    </AlertDescription>
  </Alert>
);

const EmptyState = () => (
  <div className="w-full py-8 text-center text-muted-foreground">
    表示できるトラックがありません。
  </div>
);

export default function Carousel({ tracks }: { tracks: Array<Track> }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: false,
    dragFree: true,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // エラーチェック: tracks が undefined または null の場合
  if (!tracks) {
    return <ErrorDisplay />;
  }

  // 空配列チェック
  if (tracks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative">
      <div className="cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-4">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>

      {tracks.length > 1 && (
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
      )}
    </div>
  );
}
