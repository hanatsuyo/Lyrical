"use client";

import { useState, useEffect } from "react";
import type { Thread } from "@/app/types/thread";
import dayjs from "dayjs";
export default function Information({ thread_id }: { thread_id: string }) {
  const [threadInfo, setThreadInfo] = useState<Thread>();
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
    } catch (error) {
      console.error("Error fetching thread:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchThread();
  }, []);

  const getCategory = (category: string | undefined) => {
    if (!category) return false;
    switch (category) {
      case "video":
        return "映像";
      case "source":
        return "音源";
      case "other":
        return "その他";
    }
  };

  if (isLoading) {
    return <p>loading...</p>;
  } else {
    return (
      <>
        <span className="flex justify-center text-6xl">
          {threadInfo?.emoji}
        </span>
        <h1 className="text-3xl font-bold mt-8">{threadInfo?.title}</h1>
        <div className="flex justify-between mt-2">
          {threadInfo?.category && (
            <p className="bg-black text-white py-1 px-4 rounded-full">
              {getCategory(threadInfo?.category)}
            </p>
          )}
          <p>公開：{dayjs(threadInfo?.created_at).format("YYYY年MM月D日")}</p>
        </div>
      </>
    );
  }
}
