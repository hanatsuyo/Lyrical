"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/components/Loading";
import { getNameById } from "@/app/util/client/getName";
import CommentDialog from "./CommentDialog";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import useSWR, { mutate } from "swr";
import { useState } from "react";

type CommentType = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
};

type CommentWithUser = CommentType & {
  userName: string | null;
};

const fetchCommentsAndUserNames = async (
  url: string
): Promise<CommentWithUser[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("コメントの取得に失敗しました");
  }
  const commentsData: CommentType[] = await response.json();

  return Promise.all(
    commentsData.map(async (comment) => ({
      ...comment,
      userName: await getNameById(comment.user_id),
    }))
  );
};

export default function CommentContents({
  thread_id,
  trackId,
}: {
  thread_id: string;
  trackId: string;
}) {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const queryParams = new URLSearchParams({
    thread_id,
    trackId,
  }).toString();
  const apiUrl = `/api/database/comment/get/comment_list?${queryParams}`;

  const {
    data: comments,
    error,
    isLoading,
  } = useSWR<CommentWithUser[]>(apiUrl, fetchCommentsAndUserNames);

  const handleCommentSuccess = async () => {
    await mutate(apiUrl);
    setIsFormSubmitting(false);
  };

  const sortedComments = useMemo(() => {
    if (!comments) return [];
    return [...comments].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [comments]);

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <CommentForm
          thread_id={thread_id}
          trackId={trackId}
          onSuccess={handleCommentSuccess}
          isSubmitting={isFormSubmitting}
          setSubmitting={setIsFormSubmitting}
          minHeight="40px"
        />
        <div className="space-y-6 mt-8">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : !comments || comments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              まだコメントはありません
            </p>
          ) : (
            <div className="space-y-6">
              {sortedComments.map((comment, i) => (
                <div key={i}>
                  <CommentItem key={comment.id} comment={comment} />
                </div>
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
              onSuccess={handleCommentSuccess}
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
