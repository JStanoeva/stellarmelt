import { AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { noAnchors } from "../../art/anchors";
import type { DustBurst } from "../../art/dust";
import type { Track } from "../../content/types";
import { usePlayerView } from "../../hooks/usePlayerView";
import { useShowArt } from "../../hooks/useShowArt";
import { useWordsSwap } from "../../hooks/useWordsSwap";
import SongArticle from "./SongArticle";

type Props = { track: Track };

// One song's page: moving to another song fades this one out and the next one in, over the same planet and footer.
export default function SongView({ track }: Props) {
  const dust = useRef<DustBurst | null>(null);
  useShowArt("contact", noAnchors, dust);
  usePlayerView();
  const swap = useWordsSwap(dust);
  const [shownSlug, setShownSlug] = useState(track.slug);
  const [moved, setMoved] = useState(false);
  if (shownSlug !== track.slug) {
    setShownSlug(track.slug);
    setMoved(true);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <SongArticle key={track.slug} track={track} moved={moved} swap={swap} />
    </AnimatePresence>
  );
}
