"use client"

import SpotifyArtistWidget from "./spotify-artist-widget"

/**
 * Example component showing different ways to use the SpotifyArtistWidget
 * This demonstrates the flexibility and ease of integration
 */
export default function SpotifyArtistWidgetExample() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Spotify Artist Widget - Integration Examples</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Here are different ways to use the SpotifyArtistWidget component in the app.
          Copy any of these examples and customize them for your needs.
        </p>
      </div>

      {/* Basic Usage */}
      <div>
        <h2 className="text-xl font-semibold mb-4">1. Basic Usage</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-sm overflow-x-auto">
{`import SpotifyArtistWidget from './components/spotify-artist-widget'

<SpotifyArtistWidget artistName="Nicky Jam" />`}
          </pre>
        </div>
        <div className="flex justify-center">
          <SpotifyArtistWidget artistName="Nicky Jam" />
        </div>
      </div>

      {/* Custom Styling */}
      <div>
        <h2 className="text-xl font-semibold mb-4">2. Custom Styling</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-sm overflow-x-auto">
{`<SpotifyArtistWidget 
  artistName="Tyga" 
  className="max-w-sm mx-auto shadow-2xl" 
/>`}
          </pre>
        </div>
        <div className="flex justify-center">
          <SpotifyArtistWidget 
            artistName="Tyga" 
            className="max-w-sm mx-auto shadow-2xl" 
          />
        </div>
      </div>

      {/* Custom Configuration */}
      <div>
        <h2 className="text-xl font-semibold mb-4">3. Custom Configuration</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-sm overflow-x-auto">
{`<SpotifyArtistWidget 
  artistName="Arcángel"
  initialTrackCount={3}
  showSeeMore={false}
  showPreviews={false}
  loadingMessage="Loading {artist} data..."
/>`}
          </pre>
        </div>
        <div className="flex justify-center">
          <SpotifyArtistWidget 
            artistName="Arcángel"
            initialTrackCount={3}
            showSeeMore={false}
            showPreviews={false}
            loadingMessage="Loading {artist} data..."
          />
        </div>
      </div>

      {/* Multiple Widgets */}
      <div>
        <h2 className="text-xl font-semibold mb-4">4. Multiple Widgets in a Grid</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-sm overflow-x-auto">
{`const artists = ["Soulja Boy", "DJ Luian", "Jay Wheeler"]

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {artists.map(artist => (
    <SpotifyArtistWidget key={artist} artistName={artist} />
  ))}
</div>`}
          </pre>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotifyArtistWidget artistName="Soulja Boy" />
          <SpotifyArtistWidget artistName="DJ Luian" />
          <SpotifyArtistWidget artistName="Jay Wheeler" />
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">🚀 Quick Integration Guide</h2>
        <div className="space-y-4 text-blue-800">
          <div>
            <h3 className="font-semibold">1. Copy the Component</h3>
            <p>Copy <code className="bg-blue-100 px-2 py-1 rounded">spotify-artist-widget.tsx</code> to your components folder</p>
          </div>
          <div>
            <h3 className="font-semibold">2. Set Up the API Route</h3>
            <p>Copy <code className="bg-blue-100 px-2 py-1 rounded">app/api/spotify/artist/[name]/route.ts</code> to your API routes</p>
          </div>
          <div>
            <h3 className="font-semibold">3. Configure Spotify Credentials</h3>
            <p>Add your Spotify API credentials to your environment variables</p>
          </div>
          <div>
            <h3 className="font-semibold">4. Use the Component</h3>
            <p>Import and use <code className="bg-blue-100 px-2 py-1 rounded">&lt;SpotifyArtistWidget artistName="Artist Name" /&gt;</code></p>
          </div>
        </div>
      </div>
    </div>
  )
} 