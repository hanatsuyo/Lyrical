import { getTrack } from "@/app/util/getTrack";

interface SongProps {
  trackId: string;
}

async function Song({ trackId }: SongProps) {
  try {
    const track = await getTrack(trackId);

    return (
      <div>
        <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
          <img
            src={track.album.images[0].url}
            alt={track.name}
            className="w-48 h-48 rounded-lg shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{track.name}</h1>
            <p className="text-xl mb-4">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
            <p className="text-gray-600">Album: {track.album.name}</p>
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load track"}
        </p>
      </div>
    );
  }
}

export default Song;
