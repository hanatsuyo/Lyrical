"use server";

import { cookies } from "next/headers";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const COOKIE_NAME = "spotify_access_token";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// トークンを設定するserver action
// export async function setSpotifyToken() {
//   const token = await getAccessToken();
//   cookies().set({
//     name: COOKIE_NAME,
//     value: token,
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: 3540,
//     path: "/",
//   });
// }

export async function getAccessToken(): Promise<string> {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data: SpotifyTokenResponse = await response.json();

    return data.access_token;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
}
