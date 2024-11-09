"use client";

import { useState, useEffect } from "react";
import type { Thread } from "@/app/types/thread";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryList } from "@/app/data/category";

// Spotifyの曲情報の型定義
interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

export default function Information({
  thread_id,
  trackId,
}: {
  thread_id: string;
  trackId: string;
}) {
  const [threadInfo, setThreadInfo] = useState<Thread>();
  const [trackInfo, setTrackInfo] = useState<SpotifyTrack>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchThread = async () => {
    try {
      const response = await fetch(
        `/api/database/thread/get/thread_information?thread_id=${thread_id}`
      );
      if (!response.ok) {
        throw new Error("スレッド情報の取得に失敗しました。");
      }

      const data = await response.json();
      setThreadInfo(data);

      // スレッド情報取得後にSpotify APIを呼び出す
    } catch (error) {
      console.error("Error fetching thread:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpotifyTrack = async () => {
    try {
      const response = await fetch(`/api/spotify/tracks/${trackId}`);
      if (!response.ok) {
        throw new Error("Spotify情報の取得に失敗しました。");
      }
      const data = await response.json();
      setTrackInfo(data);
    } catch (error) {
      console.error("Error fetching Spotify track:", error);
    }
  };

  useEffect(() => {
    fetchThread();
    fetchSpotifyTrack();
  }, []);

  const getCategory = (category: string | undefined) => {
    if (!category) return false;

    const foundCategory = categoryList.find((item) => item.value === category);
    return foundCategory ? foundCategory.label : false;
  };
  if (isLoading) {
    return (
      <>
        {/* Spotify情報のスケルトン */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-24 w-24" />
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* 既存のスケルトン */}
        <div className="mt-8">
          <Skeleton className="h-10 w-3/4" />
        </div>
        <div className="flex justify-between mt-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-32" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Spotify楽曲情報 */}
      {trackInfo && (
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <img
            src={trackInfo.album.images[0].url}
            alt={trackInfo.album.name}
            width={96}
            height={96}
            className="rounded-md"
          />
          <div>
            <h2 className="font-bold text-lg">{trackInfo.name}</h2>
            <p className="text-gray-600">
              {trackInfo.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* 既存の表示内容 */}
      <div className="mt-12">
        <h1 className="text-3xl font-bold mt-8">{threadInfo?.title}</h1>
        <div className="flex justify-between mt-4">
          {threadInfo?.category && (
            <p className="bg-black text-white py-1 px-4 rounded-full">
              {getCategory(threadInfo?.category)}
            </p>
          )}
          <p>公開：{dayjs(threadInfo?.created_at).format("YYYY年MM月D日")}</p>
        </div>
      </div>
    </>
  );
}
