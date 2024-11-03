import Information from "./information";
export default function ThreadContent({ params }) {
  return (
    <div className="py-6 px-4">
      <div className="max-w-[800px] mx-auto">
        <Information thread_id={params.thread_id} />
      </div>
    </div>
  );
}
