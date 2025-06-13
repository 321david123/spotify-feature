import { NextResponse } from "next/server"

export async function GET() {
  console.log("LOG: /api/auth/spotify/login route handler started.")

  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI

  console.log(`LOG: SPOTIFY_CLIENT_ID: ${SPOTIFY_CLIENT_ID ? "Found" : "MISSING!"}`)
  console.log(`LOG: SPOTIFY_REDIRECT_URI: ${SPOTIFY_REDIRECT_URI ? "Found" : "MISSING!"}`)

  if (!SPOTIFY_CLIENT_ID) {
    const errorMessage =
      "Server Configuration Error: SPOTIFY_CLIENT_ID is not set. Please ensure this environment variable is configured."
    console.error("ERROR: " + errorMessage)
    return new NextResponse(errorMessage, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }

  if (!SPOTIFY_REDIRECT_URI) {
    const errorMessage =
      "Server Configuration Error: SPOTIFY_REDIRECT_URI is not set. Please ensure this environment variable is configured."
    console.error("ERROR: " + errorMessage)
    return new NextResponse(errorMessage, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }

  const scope = "user-read-currently-playing user-read-recently-played"
  console.log(`LOG: Scope for Spotify: ${scope}`)

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: SPOTIFY_REDIRECT_URI,
  })

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
  console.log(`LOG: Constructed Spotify Auth URL: ${spotifyAuthUrl}`)

  try {
    console.log("LOG: Attempting to redirect to Spotify by manually setting headers...")
    // Manually create a redirect response
    const response = new NextResponse(null, {
      status: 302, // Or 307 for temporary redirect
      headers: {
        Location: spotifyAuthUrl,
      },
    })
    return response
  } catch (error) {
    console.error("ERROR: Exception during manual redirect response creation:", error)
    const message = error instanceof Error ? error.message : "An unknown error occurred during the redirect attempt."
    return NextResponse.json(
      {
        error: "Redirect failed",
        message: "Failed to initiate redirection to Spotify.",
        details: message,
      },
      { status: 500 },
    )
  }
}
