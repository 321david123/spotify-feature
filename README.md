# Spotify Now Playing Widget

Try it out now
# Live demo: https://spotify-feature.davidmtz.me 
<img width="842" alt="Screenshot 2025-06-13 at 3 33 09 AM" src="https://github.com/user-attachments/assets/b0135871-0add-4d63-9b81-3fdfb32a33a6" />


*last played*

<img width="389" alt="Screenshot 2025-06-13 at 3 34 46 AM" src="https://github.com/user-attachments/assets/1db1cbe1-4225-4aa3-ae74-f60cd09934fd" />

A modern, Spotify "Now Playing" widget built with Next.js, React, and Tailwind CSS. Shows your currently playing or most recently played Spotify track, with progress bar and clickable links to Spotify.

# Running Locally

1. **Clone the repository:**
   ```bash
   git clone <repo>
   cd spotify-feature
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   yarn install
   ```

3. **Set environment variables:**
   - Create a `.env.local` file in the root directory.
   - Add your Spotify API credentials:
     ```env
     SPOTIFY_CLIENT_ID=your_spotify_client_id
     SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
     SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/auth/spotify/callback
    open http://127.0.0.1:3000 instead of localhost:3000 when testing it
     ```
   - Register the redirect URI in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

4. **Run the development server:**
   ```bash
   pnpm dev
   # or
   yarn dev
   ```
   Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.


## Integrating into Another Next.js Codebase

This widget is designed to be **modular and portable**:

Not hard to integrate (Uses tailwind)

  - Import and use the `SpotifyWidget` component wherever you want in your new app.

**No global state, no vendor lock-in, and no database required (it could use one tho) !**

## Notes
- Make sure to use HTTPS and the correct domain in production.
- Each user sees their own Spotify activity (session-based, secure).

---


