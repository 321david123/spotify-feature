# Spotify Artist Widget

Interactive Spotify widget for musicians/artists that displays an artist's discography, latest songs, and best hits. Visitors can click on artist names to explore their full catalog of music.

## What It Does

The Spotify Artist Widget fetches and displays:
- **Artist Profile**: Name, image, follower count, genres
- **Top Tracks**: Most popular songs (expandable from 5 to 10 tracks)
- **Latest Album**: Most recent release with track listings
- **Interactive Features**: Click to open in Spotify
- **Responsive Design**: Works on desktop and mobile

## Live Demo

Visit the live demo to see the widget in action: https://spotify-feature.davidmtz.me

## Files You Need to Copy

### 1. Main Component
**File**: `components/spotify-artist-widget.tsx`
- The main widget component
- Handles all UI interactions and data display
- Self-contained with TypeScript interfaces

### 2. API Route
**File**: `app/api/spotify/artist/[name]/route.ts`
- Handles Spotify API calls
- Fetches artist data, top tracks, and albums
- Uses client credentials flow (no user auth required)

### 3. Utility Functions
**File**: `lib/spotify-utils.ts`
- Helper functions for artist validation
- Predefined artist lists
- Widget configuration utilities

### 4. Example Component (Optional)
**File**: `components/spotify-artist-widget-example.tsx`
- Shows different usage examples
- Live demonstrations of various configurations
- Integration guide

## Quick Start

### Step 1: Copy the Files
Copy these files to your project:
```
components/spotify-artist-widget.tsx
app/api/spotify/artist/[name]/route.ts
lib/spotify-utils.ts
```

### Step 2: Set Up Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get your Client ID and Client Secret
4. Add to your environment variables:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Step 3: Use the Component
```tsx
import SpotifyArtistWidget from './components/spotify-artist-widget'

// Basic usage
<SpotifyArtistWidget artistName="Drake" />

// With custom styling
<SpotifyArtistWidget 
  artistName="Bad Bunny" 
  className="max-w-sm mx-auto shadow-2xl" 
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `artistName` | `string` | **Required** | The name of the artist to display |
| `className` | `string` | `""` | Additional CSS classes for styling |
| `apiEndpoint` | `string` | `/api/spotify/artist/[name]` | Custom API endpoint |
| `showSeeMore` | `boolean` | `true` | Whether to show the "See More" functionality |
| `initialTrackCount` | `number` | `5` | Number of tracks to show initially |
| `showPreviews` | `boolean` | `true` | Whether to show preview buttons |
| `loadingMessage` | `string` | `"Loading artist..."` | Custom loading message |
| `errorMessage` | `string` | `"Could not load artist data"` | Custom error message |

## Usage Examples

### Basic Integration
```tsx
import SpotifyArtistWidget from './components/spotify-artist-widget'

export default function ArtistPage() {
  return (
    <div className="p-8">
      <h1>Featured Artist</h1>
      <SpotifyArtistWidget artistName="Nicky Jam" />
    </div>
  )
}
```

### Multiple Artists Grid
```tsx
import SpotifyArtistWidget from './components/spotify-artist-widget'

const artists = ["Drake", "Bad Bunny", "Taylor Swift", "The Weeknd"]

export default function ArtistsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
      {artists.map(artist => (
        <SpotifyArtistWidget key={artist} artistName={artist} />
      ))}
    </div>
  )
}
```

### Custom Configuration
```tsx
<SpotifyArtistWidget 
  artistName="Arcángel"
  className="max-w-sm"
  initialTrackCount={3}
  showSeeMore={false}
  showPreviews={false}
  loadingMessage="Loading Arcángel's music..."
/>
```

## What to Change for Your Project

### 1. API Endpoint (if needed)
If you want to use a different API endpoint:
```tsx
<SpotifyArtistWidget 
  artistName="Artist Name"
  apiEndpoint="/api/your-custom-endpoint/[name]"
/>
```

### 2. Styling
The widget uses Tailwind CSS classes. You can:
- Add custom classes via the `className` prop
- Modify the component's internal styling
- Override with your own CSS

### 3. Artist Lists
Use the utility functions to get predefined artist lists:
```tsx
import { getLatinArtists, getHipHopArtists } from './lib/spotify-utils'

const latinArtists = getLatinArtists() // ["Bad Bunny", "Nicky Jam", ...]
const hipHopArtists = getHipHopArtists() // ["Drake", "The Weeknd", ...]
```

### 4. Error Handling
Customize error messages and loading states:
```tsx
<SpotifyArtistWidget 
  artistName="Artist Name"
  loadingMessage="Loading {artist} data..."
  errorMessage="Failed to load {artist} information"
/>
```

## Technical Details

### API Response Structure
The widget expects this data structure from the API:
```typescript
interface ArtistData {
  artist: {
    name: string
    image: string
    followers: number
    genres: string[]
    spotifyUrl: string
  }
  topTracks: Track[]
  latestAlbum: {
    name: string
    image: string
    tracks: Track[]
    spotifyUrl: string
  }
}

interface Track {
  name: string
  duration: string
  previewUrl: string
  spotifyUrl: string
}
```

### Spotify API Endpoints Used
- `/search` - Find artist by name
- `/artists/{id}` - Get artist details
- `/artists/{id}/top-tracks` - Get top tracks
- `/artists/{id}/albums` - Get albums

### Authentication
- Uses **Client Credentials Flow** (no user login required)
- Access to public Spotify data only
- No user-specific data like playlists

## Troubleshooting

### Common Issues

1. **"Could not load artist data"**
   - Check your Spotify API credentials
   - Verify the artist name exists on Spotify
   - Check your API route is working

2. **Widget not loading**
   - Ensure the API route is copied correctly
   - Check browser console for errors
   - Verify environment variables are set

3. **Styling issues**
   - Make sure Tailwind CSS is installed
   - Check if custom classes are being applied
   - Verify responsive classes work on your setup

### Environment Variables
Make sure these are set in your `.env.local`:
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repo>
   cd spotify-feature
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set environment variables:**
   Create `.env.local` with your Spotify credentials

4. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Dependencies

The widget requires:
- **Next.js 13+** (for App Router)
- **React 18+**
- **Tailwind CSS** (for styling)
- **TypeScript** (for type safety)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Progressive enhancement (works without JavaScript for basic display)

## Performance

- Lazy loading of artist data
- Optimized API calls
- Cached responses
- Minimal bundle size

## Security

- No sensitive data exposed
- API credentials kept server-side
- No user authentication required
- Public Spotify data only

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

---


