import { AnimatePresence } from "motion/react";
import { useState } from "react";
import type { Track } from "../../content/types";
import { usePlayerView } from "../../hooks/usePlayerView";
import { useShowArt } from "../../hooks/useShowArt";
import SongArticle from "./SongArticle";

type Props = { track: Track };

// One song's page: moving to another song fades this one out and the next one in, over the same planet and footer.
export default function SongView({ track }: Props) {
  useShowArt("contact");
  usePlayerView();
  const [shownSlug, setShownSlug] = useState(track.slug);
  const [moved, setMoved] = useState(false);
  if (shownSlug !== track.slug) {
    setShownSlug(track.slug);
    setMoved(true);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <SongArticle key={track.slug} track={track} moved={moved} />
    </AnimatePresence>
  );
}
