import { useParams } from "react-router";
import { trackBySlug } from "../lib/tracks";
import SongView from "../sections/discography/SongView";
import NotFoundPage from "./NotFoundPage";

// /discography/:slug: one song's page, or the 404 page for a slug that isn't on the album.
export default function SongPage() {
  const track = trackBySlug(useParams().slug);
  if (!track) return <NotFoundPage />;
  return <SongView track={track} />;
}
