"use client"

import { useEffect, useState } from "react"
import SpotifyWidget from "../spotify-widget" // Adjusted path

// Define the structure of the song data
interface SongData {
  albumArtUrl: string
  title: string
  artist: string
  progressMs: number
  durationMs: number
  isPlaying: boolean
}

export default function DashboardPage() {
  const [songData, setSongData] = useState<SongData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real application, you would fetch this data from your API endpoint
    // which in turn fetches from Spotify.
    // For now, we'll use mock data after a delay to simulate API call.
    const fetchMockData = async () => {
      setIsLoading(true)
      setError(null)
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

      // Simulate a successful API response
      setSongData({
        albumArtUrl: "/placeholder.svg?width=200&height=200", // Placeholder image
        title: "TELEKINESIS (feat. SZA & Future)",
        artist: "Travis Scott, SZA, Future",
        progressMs: 90000, // 1:30
        durationMs: 353000, // 5:53
        isPlaying: true,
      })
      // Or simulate no song playing:
      // setSongData(null);

      // Or simulate an error:
      // setError("Failed to fetch now playing data.");
      // setSongData(null);

      setIsLoading(false)
    }

    fetchMockData()
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Your Spotify Activity</h1>
      {isLoading && <p className="text-white">Loading your music...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}
      {!isLoading && !error && <SpotifyWidget songData={songData} />}

      {/* You could add a logout button here */}
      {/* <button
        onClick={async () => {
          // Call your /api/auth/logout route
          // Redirect to home page
        }}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button> */}
    </main>
  )
}
