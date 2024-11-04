import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type CommentType = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
};

type CommentWithUser = CommentType & {
  userName: string | null;
};

export default function CommentItem({ comment }: { comment: CommentWithUser }) {
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
