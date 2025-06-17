"use client"

import type React from "react"
import SpotifyArtistWidget from "../components/spotify-artist-widget"

const MusicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <MusicIcon className="w-10 h-10" />
          Spotify Artist Widget
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          This is how the Spotify artist widget would look for different artists. Each widget shows their latest songs and best hits. Click on any artist name to explore their discography.
        </p>
      </div>

      {/* Artist Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Nicky Jam */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Nicky Jam</h2>
            <SpotifyArtistWidget artistName="Nicky Jam" />
          </div>

          {/* Tyga */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Tyga</h2>
            <SpotifyArtistWidget artistName="Tyga" />
          </div>

          {/* Arcángel */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Arcángel</h2>
            <SpotifyArtistWidget artistName="Arcángel" />
          </div>

          {/* Soulja Boy */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Soulja Boy</h2>
            <SpotifyArtistWidget artistName="Soulja Boy" />
          </div>

          {/* DJ Luian */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">DJ Luian</h2>
            <SpotifyArtistWidget artistName="DJ Luian" />
          </div>

          {/* Jay Wheeler */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Jay Wheeler</h2>
            <SpotifyArtistWidget artistName="Jay Wheeler" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16">
        <p className="text-white/70 text-sm">
          Powered by Spotify Web API • Built with Next.js & React
        </p>
      </div>
    </main>
  )
}
