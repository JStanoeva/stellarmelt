import { useParams } from "react-router";
import { trackBySlug } from "../lib/tracks";
import ListeningRoom from "../sections/listen/ListeningRoom";
import NotFoundPage from "./NotFoundPage";

// /listen plays the whole album and /listen/:slug one song; a slug that isn't on the album gets the 404 page.
export default function ListenPage() {
  const { slug } = useParams();
  const track = trackBySlug(slug);
  if (slug !== undefined && !track) return <NotFoundPage />;
  return <ListeningRoom track={track} />;
}
