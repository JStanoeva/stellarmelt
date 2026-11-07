import { use, useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Site } from "../app/site";
import { createBurst, startBurst, type DustBurst } from "../art/dust";

export type WordsSwap = {
  open: boolean;
  // moveFocus: a keyboard press, so focus follows the swap.
  press: (moveFocus: boolean) => void;
  // True once after a keyboard press, for whichever side arrives.
  takeFocus: () => boolean;
  // How far through a song's words the reader is (0 to 1), so a turn of the phone keeps their place.
  rememberPlace: (title: string, fraction: number) => void;
  placeIn: (title: string) => number;
};

// A song page's swap between its star and its words, with the planet's own stardust. It lives above the song, so the words stay open from song to song.
export function useWordsSwap(dust: RefObject<DustBurst | null>): WordsSwap {
  const { reduced } = use(Site);
  const [open, setOpen] = useState(false);
  const focusPending = useRef(false);
  const place = useRef<{ title: string; fraction: number } | null>(null);

  const press = useCallback((moveFocus: boolean) => {
    focusPending.current = moveFocus;
    place.current = null;
    setOpen((wasOpen) => !wasOpen);
  }, []);

  const takeFocus = useCallback(() => {
    const pending = focusPending.current;
    focusPending.current = false;
    return pending;
  }, []);

  const rememberPlace = useCallback((title: string, fraction: number) => {
    place.current = { title, fraction };
  }, []);

  const placeIn = useCallback(
    (title: string) =>
      place.current?.title === title ? place.current.fraction : 0,
    [],
  );

  const shown = useRef(open);
  useLayoutEffect(() => {
    if (open === shown.current) return;
    shown.current = open;
    if (reduced) return;
    dust.current ??= createBurst();
    startBurst(dust.current, open ? 1 : -1, "data-song-swap");
  }, [open, reduced, dust]);

  return { open, press, takeFocus, rememberPlace, placeIn };
}
