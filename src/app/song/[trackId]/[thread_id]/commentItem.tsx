import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CommentItem({
  comment,
}: {
  comment: Comment & { userName: string | null };
}) {
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

// メインのコンポーネントのreturn部分を修正
return (
  <div className="space-y-6">
    {comments.length === 0 ? (
      <p className="text-center text-gray-500 py-4">まだコメントはありません</p>
    ) : (
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    )}
  </div>
);
