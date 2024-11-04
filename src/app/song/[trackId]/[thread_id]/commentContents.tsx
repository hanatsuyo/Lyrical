"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getNameById } from "@/app/util/getName";
import CommentDialog from "./commentDialog";
import CommentForm from "./commentForm";

type CommentType = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
};

type CommentWithUser = CommentType & {
  userName: string | null;
};

type SkeletonItem = {
  id: string;
};

function CommentItem({ comment }: { comment: CommentWithUser }) {
  return (
    <div className="flex space-x-4">
      <Avatar className="h-10 w-10 bg-black text-white">
        <AvatarFallback>
          {(comment.userName || "UN").slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold">
            {comment.userName || "Unknown User"}
          </h4>
          <span className="text-sm text-gray-500">
            {new Date(comment.created_at).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="mt-1 text-gray-700 whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export default function CommentContents({
  thread_id,
  trackId,
}: {
  thread_id: string;
  trackId: string;
}) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skeletonItems] = useState<SkeletonItem[]>(
    Array.from({ length: 3 }, () => ({ id: crypto.randomUUID() }))
  );

  const fetchCommentsAndUserNames = async () => {
    try {
      const queryParams = new URLSearchParams({
        thread_id,
        trackId,
      });

      const response = await fetch(
        `/api/database/comment/get/comment_list?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("コメントの取得に失敗しました");
      }

      const commentsData = await response.json();

      const commentsWithUserNames = await Promise.all(
        commentsData.map(async (comment: CommentType) => {
          const userName = await getNameById(comment.user_id);
          return {
            ...comment,
            userName,
          };
        })
      );

      setComments(commentsWithUserNames);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentsAndUserNames();
  }, [thread_id, trackId]);

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {skeletonItems.map((item) => (
          <div key={item.id} className="flex space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            まだコメントはありません
          </p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
      <CommentDialog>
        {({ setOpen }) => (
          <CommentForm
            thread_id={thread_id}
            song_id={trackId}
            setOpen={setOpen}
            onSuccess={fetchCommentsAndUserNames}
          />
        )}
      </CommentDialog>
    </>
  );
}
