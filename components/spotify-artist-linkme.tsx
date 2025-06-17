"use client"

import Image from "next/image"
import type React from "react"
import { useState, useEffect } from "react"

// Define the structure of the track data
interface Track {
  id: string
  name: string
  album: {
    name: string
    images: Array<{ url: string; width: number; height: number }>
    external_urls: { spotify: string }
  }
  external_urls: { spotify: string }
  duration_ms: number
  popularity: number
  preview_url?: string
}

// Define the structure of the artist data
interface ArtistData {
  id: string
  name: string
  images: Array<{ url: string; width: number; height: number }>
  external_urls: { spotify: string }
  followers: { total: number }
  genres: string[]
  popularity: number
  topTracks: Track[]
  latestAlbum?: {
    name: string
    images: Array<{ url: string; width: number; height: number }>
    external_urls: { spotify: string }
    tracks: Track[]
  }
}

// Main component props interface for LinkMe style
interface SpotifyArtistLinkMeProps {
  /** The name of the artist to display */
  artistName: string
  /** Additional CSS classes for styling */
  className?: string
  /** Custom API endpoint (optional, defaults to /api/spotify/artist/[name]) */
  apiEndpoint?: string
  /** Whether to show the "See More" functionality (defaults to true) */
  showSeeMore?: boolean
  /** Number of tracks to show initially (defaults to 5) */
  initialTrackCount?: number
  /** Whether to show preview buttons (defaults to true) */
  showPreviews?: boolean
  /** Custom loading message */
  loadingMessage?: string
  /** Custom error message */
  errorMessage?: string
  /** Whether to show the artist header (defaults to true) */
  showHeader?: boolean
  /** Whether to show follower count (defaults to true) */
  showFollowers?: boolean
  /** Whether to show genres (defaults to true) */
  showGenres?: boolean
  /** Whether to show the tab navigation (defaults to true) */
  showTabs?: boolean
  /** Default active tab (defaults to 'top') */
  defaultTab?: 'top' | 'latest'
}

// Default props for LinkMe style
const defaultProps: Partial<SpotifyArtistLinkMeProps> = {
  showSeeMore: true,
  initialTrackCount: 5,
  showPreviews: true,
  loadingMessage: "Loading music...",
  errorMessage: "Could not load music data",
  showHeader: true,
  showFollowers: true,
  showGenres: true,
  showTabs: true,
  defaultTab: 'top'
}

// Spotify logo SVG
const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="#1DB954" />
    <path d="M17.25 16.13a.75.75 0 0 1-1.03.23c-2.82-1.73-6.38-2.12-10.59-1.17a.75.75 0 1 1-.33-1.47c4.57-1.03 8.5-.6 11.6 1.25.36.22.47.69.23 1.03zm1.47-2.93a.94.94 0 0 1-1.29.29c-3.23-1.98-8.16-2.56-11.98-1.41a.94.94 0 1 1-.54-1.81c4.23-1.27 9.57-.64 13.18 1.54.44.27.58.85.29 1.29zm.16-2.98c-3.7-2.19-9.85-2.39-13.36-1.5a1.13 1.13 0 1 1-.52-2.2c3.97-.94 10.7-.71 14.87 1.7a1.13 1.13 0 0 1-1.13 1.96z" fill="white"/>
  </svg>
)

// Play icon
const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

// Music note icon
const MusicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

// Chevron down icon
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6,9 12,15 18,9" />
  </svg>
)

// Chevron up icon
const ChevronUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="18,15 12,9 6,15" />
  </svg>
)

export default function SpotifyArtistLinkMe({ 
  artistName, 
  className = "",
  apiEndpoint,
  showSeeMore = true,
  initialTrackCount = 5,
  showPreviews = true,
  loadingMessage,
  errorMessage,
  showHeader = true,
  showFollowers = true,
  showGenres = true,
  showTabs = true,
  defaultTab = 'top'
}: SpotifyArtistLinkMeProps) {
  const [artistData, setArtistData] = useState<ArtistData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'top' | 'latest'>(defaultTab)
  const [showAllTracks, setShowAllTracks] = useState(false)

  // Use default messages if not provided
  const finalLoadingMessage = loadingMessage || defaultProps.loadingMessage || "Loading music..."
  const finalErrorMessage = errorMessage || defaultProps.errorMessage || "Could not load music data"

  useEffect(() => {
    const fetchArtistData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const endpoint = apiEndpoint || `/api/spotify/artist/${encodeURIComponent(artistName)}`
        const res = await fetch(endpoint)
        if (!res.ok) {
          throw new Error(`Failed to fetch artist data: ${res.status}`)
        }
        const data = await res.json()
        setArtistData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : finalErrorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (artistName) {
      fetchArtistData()
    }
  }, [artistName, apiEndpoint, finalErrorMessage])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  if (isLoading) {
    return (
      <div className={`w-full max-w-md p-6 bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center min-h-[120px]">
          <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
        <p className="text-center text-gray-500 text-sm">{finalLoadingMessage}</p>
      </div>
    )
  }

  if (error || !artistData) {
    return (
      <div className={`w-full max-w-md p-6 bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center min-h-[120px]">
          <div className="text-center">
            <MusicIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-1">{finalErrorMessage}</p>
            <p className="text-xs text-gray-400">{error || 'Artist not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const allTracks = activeTab === 'top' ? artistData.topTracks : artistData.latestAlbum?.tracks || []
  const displayedTracks = showAllTracks ? allTracks : allTracks.slice(0, initialTrackCount)
  const hasMoreTracks = showSeeMore && allTracks.length > initialTrackCount

  return (
    <div className={`w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Artist Header */}
      {showHeader && (
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <Image
                src={artistData.images[0]?.url || "/placeholder-user.jpg"}
                alt={`${artistData.name} profile`}
                width={64}
                height={64}
                className="rounded-full aspect-square object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate text-gray-900" title={artistData.name}>
                <a 
                  href={artistData.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  {artistData.name}
                  <SpotifyIcon className="w-4 h-4" />
                </a>
              </h2>
              {showFollowers && (
                <p className="text-sm text-gray-500">
                  {formatFollowers(artistData.followers.total)} followers
                </p>
              )}
              {showGenres && artistData.genres.length > 0 && (
                <p className="text-xs text-gray-400 truncate">
                  {artistData.genres.slice(0, 2).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          {showTabs && (
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setActiveTab('top')
                  setShowAllTracks(false)
                }}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'top' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Top Tracks
              </button>
              <button
                onClick={() => {
                  setActiveTab('latest')
                  setShowAllTracks(false)
                }}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'latest' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Latest Album
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tracks List */}
      <div className="px-6 pb-6">
        <div className="space-y-2">
          {displayedTracks.map((track, index) => (
            <div 
              key={track.id} 
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-medium">{index + 1}</span>
              </div>
              
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <Image
                    src={track.album.images[0]?.url || "/placeholder.svg?width=40&height=40&text=Album"}
                    alt={`${track.album.name} album art`}
                    width={40}
                    height={40}
                    className="rounded-md aspect-square object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate text-gray-900" title={track.name}>
                    <a 
                      href={track.external_urls.spotify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-green-600 transition-colors"
                    >
                      {track.name}
                    </a>
                  </h3>
                  <p className="text-xs text-gray-500 truncate" title={track.album.name}>
                    {track.album.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{formatTime(track.duration_ms)}</span>
                {showPreviews && track.preview_url && (
                  <button 
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-green-600"
                    onClick={() => {
                      const audio = new Audio(track.preview_url)
                      audio.play()
                    }}
                    title="Play preview"
                  >
                    <PlayIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* See More/Less Button */}
        {hasMoreTracks && (
          <button
            onClick={() => setShowAllTracks(!showAllTracks)}
            className="w-full mt-4 py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {showAllTracks ? (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                See More
              </>
            )}
          </button>
        )}

        {displayedTracks.length === 0 && (
          <div className="text-center py-8">
            <MusicIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No tracks available</p>
          </div>
        )}
      </div>
    </div>
  )
} 