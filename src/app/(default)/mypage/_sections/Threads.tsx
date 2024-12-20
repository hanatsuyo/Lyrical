"use client";

import { getUserId } from "@/app/util/client/getUserId";
import type { Thread } from "@/types/thread";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { useState } from "react";

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

// フェッチャー関数
const fetcher = async (url: string) => {
  const user_id = await getUserId();
  const response = await fetch(`${url}?user_id=${user_id}`);
  if (!response.ok) throw new Error("データの取得に失敗しました。");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export default function Threads() {
  const [deleteTarget, setDeleteTarget] = useState<Thread | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: threadList,
    error,
    isLoading,
  } = useSWR<Thread[]>(
    "/api/database/thread/get/thread_list/byUserId",
    fetcher
  );

  const handleDelete = async (thread: Thread) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/database/thread`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thread_id: thread.thread_id }),
      });

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      // キャッシュを更新
      await mutate("/api/database/thread/get/thread_list/byUserId");
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-500">{error.message}</p>
      </div>
    );
  }

  if (!threadList || threadList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">スレッドがありません</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-3xl px-2 font-bold">スレッド一覧</p>
      <div className="grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-0 px-2">
        {threadList.map((thread) => (
          <Card
            key={thread.thread_id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group"
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
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                setDeleteTarget(thread);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>スレッドを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。スレッドの内容は完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "削除中..." : "削除する"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
