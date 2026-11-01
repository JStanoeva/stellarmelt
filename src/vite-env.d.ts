/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Where the song files are hosted; without it the play buttons link to Suno.
  readonly VITE_SONGS_URL?: string;
}
