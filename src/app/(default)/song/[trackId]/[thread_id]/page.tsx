import Information from "./_components/Information";
import CommentContents from "./_components/CommentContents";

export default function ThreadContent({
  params,
}: {
  params: { thread_id: string; trackId: string };
}) {
  return (
    <div className="py-6">
      <div className="max-w-[800px] mx-auto">
        <Information thread_id={params.thread_id} trackId={params.trackId} />
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
