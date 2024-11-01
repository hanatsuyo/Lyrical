"use client";
import { useState, useEffect } from "react";

export default function Song({ trackId }: { trackId: string }) {
  const [track, setTrack] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const response = await fetch(`/api/spotify/tracks/${trackId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch track");
        }

        const data = await response.json();
        setTrack(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    }

    fetchTrack();
  }, [trackId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!track) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <div className="flex items-start gap-8">
          <img
            src={track.album.images[0].url}
            alt={track.name}
            className="w-48 h-48 rounded-lg shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{track.name}</h1>
            <p className="text-xl mb-4">
              {track.artists.map((artist: any) => artist.name).join(", ")}
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
    </div>
  );
}
