import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useFlight } from "../hooks/useFlight";
import { usePlayer } from "../hooks/usePlayer";
import type { Rig } from "./flightPlan";
import {
  createSongCursors,
  followSong,
  type SongMap,
} from "./songPulse";

// Made from Tora's masters; each one loads only when its song comes on.
const songMaps = import.meta.glob<SongMap>("../content/song-maps/*.json", {
  import: "default",
});

type Props = { rig: Rig };

// Listens to the player's clock once a frame and writes what the song is doing onto the rig; first child, so every layer reads this frame's pulse.
export default function SongFollower({ rig }: Props) {
  const { current, status, readTime } = usePlayer();
  const { cruising } = useFlight();
  const slug = current?.slug;
  const [loaded, setLoaded] = useState<{ slug: string; map: SongMap } | null>(
    null,
  );
  const [cursors] = useState(createSongCursors);

  useEffect(() => {
    if (!slug) return;
    let live = true;
    // Without its map a song still plays; the sky just stays calm.
    songMaps[`../content/song-maps/${slug}.json`]?.()
      .then((map) => {
        if (live) setLoaded({ slug, map });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [slug]);

  const map = loaded?.slug === slug ? (loaded?.map ?? null) : null;
  const on = current !== null;

  useFrame((_, delta) => {
    if (rig.still) return;
    followSong(
      rig.song,
      cursors,
      {
        map,
        time: readTime(),
        on,
        playing: status === "playing" || status === "loading",
        listening: cruising && on,
        tone: current?.singer === "Orion" ? 0 : 1,
      },
      delta,
    );
  });

  return null;
}
