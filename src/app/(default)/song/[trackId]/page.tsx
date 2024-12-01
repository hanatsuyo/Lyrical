import Song from "./_sections/Song";
import CategoryTab from "./_sections/CategoryTab";

interface PageProps {
  params: {
    trackId: string;
  };
}
export default async function SongDetail({ params }: PageProps) {
  return (
    <>
      <div className="py-8">
        <Song trackId={params.trackId} />
        <div className="mt-4">
          <div className="mt-8">
            <CategoryTab trackId={params.trackId} />
          </div>
        </div>
      </div>
    </>
  );
}
