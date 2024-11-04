import Information from "./information";
import CommentDialog from "./commentDialog";
import CommentForm from "./commentForm";
import CommentContents from "./commentContents";

export default function ThreadContent({
  params,
}: {
  params: { thread_id: string; trackId: string };
}) {
  return (
    <div className="py-6 px-4">
      <div className="max-w-[800px] mx-auto">
        <Information thread_id={params.thread_id} />
        <div className="mt-16">
          <CommentContents
            thread_id={params.thread_id}
            trackId={params.trackId}
          />
        </div>
      </div>
    </div>
  );
}
