import Song from "./song";
import CategoryTab from "./categoryTab";
import FormDialog from "./formdialog";

interface PageProps {
  params: {
    trackId: string;
  };
}
export default async function SongDetail({ params }: PageProps) {
  return (
    <>
      <div className="p-8">
        <Song trackId={params.trackId} />
        <div className="mt-4">
          <FormDialog params={params.trackId} />
          <div className="mt-8">
            <CategoryTab />
          </div>
        </div>
      </div>
    </>
  );
}
