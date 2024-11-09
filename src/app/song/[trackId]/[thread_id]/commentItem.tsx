import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dayjs from "dayjs";

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
          <span className="text-sm text-gray-500 flex gap-1">
            <span>
              {dayjs(comment.created_at).format("YYYY年M月D日") ===
              dayjs().format("YYYY年M月D日")
                ? "今日"
                : dayjs(comment.created_at).format("YYYY年M月D日")}
            </span>
            <span>{dayjs(comment.created_at).format("H:mm")}</span>
          </span>
        </div>
        <p className="mt-1 text-gray-700 whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
