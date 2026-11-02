/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Plays the songs from an address other than the R2 bucket (songsUrl), e.g. local copies.
  readonly VITE_SONGS_URL?: string;
}
