import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const artistName = decodeURIComponent(name);
    
    // For demo purposes, we'll use a client credentials flow to access public data
    // In production, you might want to use the user's access token for more data
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Spotify credentials not configured" },
        { status: 500 }
      );
    }

    // Get client access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get Spotify access token" },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Search for the artist
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!searchResponse.ok) {
      return NextResponse.json(
        { error: "Failed to search for artist" },
        { status: searchResponse.status }
      );
    }

    const searchData = await searchResponse.json();
    const artist = searchData.artists?.items?.[0];

    if (!artist) {
      return NextResponse.json(
        { error: "Artist not found" },
        { status: 404 }
      );
    }

    // Get artist details, top tracks, and albums in parallel
    const [artistResponse, topTracksResponse, albumsResponse] = await Promise.all([
      fetch(`https://api.spotify.com/v1/artists/${artist.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetch(`https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album,single&market=US&limit=1`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    if (!artistResponse.ok || !topTracksResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch artist data" },
        { status: 500 }
      );
    }

    const [artistData, topTracksData, albumsData] = await Promise.all([
      artistResponse.json(),
      topTracksResponse.json(),
      albumsResponse.ok ? albumsResponse.json() : null,
    ]);

    // Get latest album tracks if available
    let latestAlbum = null;
    if (albumsData?.items?.[0]) {
      const latestAlbumId = albumsData.items[0].id;
      const albumTracksResponse = await fetch(
        `https://api.spotify.com/v1/albums/${latestAlbumId}/tracks?market=US`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (albumTracksResponse.ok) {
        const albumTracksData = await albumTracksResponse.json();
        latestAlbum = {
          name: albumsData.items[0].name,
          images: albumsData.items[0].images,
          external_urls: albumsData.items[0].external_urls,
          tracks: albumTracksData.items.map((track: any) => ({
            id: track.id,
            name: track.name,
            album: {
              name: albumsData.items[0].name,
              images: albumsData.items[0].images,
              external_urls: albumsData.items[0].external_urls,
            },
            external_urls: track.external_urls,
            duration_ms: track.duration_ms,
            popularity: 0, // Not available for album tracks
            preview_url: track.preview_url,
          })),
        };
      }
    }

    const artistInfo = {
      id: artistData.id,
      name: artistData.name,
      images: artistData.images,
      external_urls: artistData.external_urls,
      followers: artistData.followers,
      genres: artistData.genres,
      popularity: artistData.popularity,
      topTracks: topTracksData.tracks.map((track: any) => ({
        id: track.id,
        name: track.name,
        album: {
          name: track.album.name,
          images: track.album.images,
          external_urls: track.album.external_urls,
        },
        external_urls: track.external_urls,
        duration_ms: track.duration_ms,
        popularity: track.popularity,
        preview_url: track.preview_url,
      })),
      latestAlbum,
    };

    return NextResponse.json(artistInfo);
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 