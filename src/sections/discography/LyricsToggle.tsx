import { useEffect, useEffectEvent, useRef } from "react";
import type { WordsSwap } from "../../hooks/useWordsSwap";
import { sparklePath } from "./sky";

type Props = {
  swap: WordsSwap;
  // Runs before the press; the phone remembers its title's place here.
  onBeforePress?: () => void;
  // The reading phone's title row has room only for the star.
  iconOnly?: boolean;
  className?: string;
};

// Turns the star into the words and back; the word underlines while they're open, like the navbar's current page.
export default function LyricsToggle({
  swap,
  onBeforePress,
  iconOnly = false,
  className = "",
}: Props) {
  const button = useRef<HTMLButtonElement>(null);
  const { open, press, takeFocus } = swap;

  function pressNow(moveFocus: boolean) {
    onBeforePress?.();
    press(moveFocus);
  }

  useEffect(() => {
    if (!open && takeFocus()) button.current?.focus();
  }, [open, takeFocus]);

  // Escape goes back from anywhere on the page, as About's does.
  const pressEscape = useEffectEvent(() => pressNow(true));
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      pressEscape();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <button
      ref={button}
      type="button"
      aria-pressed={open}
      aria-label={iconOnly ? "Lyrics" : undefined}
      onClick={(event) => pressNow(event.detail === 0)}
      className={`group inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md font-mono text-[0.6875rem] tracking-[0.18em] whitespace-nowrap text-starlight-200 uppercase transition-colors duration-300 [text-shadow:0_0_10px_var(--color-night-950),0_0_3px_var(--color-night-950)] hover:text-stardust-50 aria-pressed:text-rose-300 ${className}`}
    >
      <svg
        viewBox="-6 -6 12 12"
        aria-hidden="true"
        className={`fill-rose-300 motion-ok:transition-transform motion-ok:duration-700 motion-ok:ease-(--ease-condense) group-aria-pressed:rotate-90 ${iconOnly ? "size-5" : "size-3.5"}`}
      >
        <path d={sparklePath} />
      </svg>
      {!iconOnly && (
        <span className="decoration-1 underline-offset-[0.7em] group-aria-pressed:underline">
          Lyrics
        </span>
      )}
    </button>
  );
}
