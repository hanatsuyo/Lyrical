"use client";

import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/app/components/Loading";
import { getNameById } from "@/app/util/getName";
import CommentDialog from "./commentDialog";
import CommentForm from "./commentForm";
import CommentItem from "./commentItem";

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
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
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

  const sortedComments = useMemo(() => {
    return [...comments].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [comments]);

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
      <div>
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              まだコメントはありません
            </p>
          ) : (
            <div className="space-y-6">
              {sortedComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
        <CommentDialog>
          {({ setOpen }) => (
            <CommentForm
              thread_id={thread_id}
              trackId={trackId}
              setOpen={setOpen}
              onSuccess={fetchCommentsAndUserNames}
              isSubmitting={isFormSubmitting}
              setSubmitting={setIsFormSubmitting}
            />
          )}
        </CommentDialog>
        {isFormSubmitting && <Loading />}
      </div>
    </>
  );
}
