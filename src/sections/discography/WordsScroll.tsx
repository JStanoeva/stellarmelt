import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SongWords } from "../../content/types";
import type { WordsSwap } from "../../hooks/useWordsSwap";
import Dissolve from "../Dissolve";

type Props = {
  title: string;
  words: SongWords;
  swap: WordsSwap;
  className?: string;
  scrollerClassName?: string;
};

// The song's words, scrolling in place behind soft edges. The choruses glow a little warmer, so the eye finds the refrain without a label.
export default function WordsScroll({
  title,
  words,
  swap,
  className = "",
  scrollerClassName = "",
}: Props) {
  const { takeFocus, placeIn, rememberPlace } = swap;
  const scroller = useRef<HTMLDivElement>(null);
  // Focusable only while there's something to scroll.
  const [scrolls, setScrolls] = useState(true);

  useLayoutEffect(() => {
    const element = scroller.current;
    if (!element) return;
    function measure() {
      if (element) setScrolls(element.scrollHeight > element.clientHeight + 1);
    }
    element.scrollTop =
      placeIn(title) * (element.scrollHeight - element.clientHeight);
    if (takeFocus() && element.scrollHeight > element.clientHeight + 1) {
      element.focus();
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [title, takeFocus, placeIn]);

  const japanese = words.lang === "ja";

  // Its list of font slices is long, so only the songs in Japanese load it.
  useEffect(() => {
    if (japanese) void import("@fontsource/zen-maru-gothic/500.css");
  }, [japanese]);

  return (
    // The ring sits out here, because the mask on the scroller would hide its own.
    <div
      className={`rounded-lg has-[[data-words]:focus-visible]:outline-2 has-[[data-words]:focus-visible]:outline-focus ${className}`}
    >
      <div
        ref={scroller}
        data-words
        tabIndex={scrolls ? 0 : undefined}
        role="group"
        aria-label={`Lyrics of ${title}`}
        lang={words.lang}
        onScroll={({ currentTarget: element }) =>
          rememberPlace(
            title,
            element.scrollTop / (element.scrollHeight - element.clientHeight),
          )
        }
        className={`words-scroll h-full overflow-y-auto overscroll-contain ${scrollerClassName}`}
      >
        {/* The clip keeps the lines' drift out of the scroll height, so no scrollbar flashes mid-swap. */}
        <div
          className={`space-y-[1.5em] overflow-clip text-[1.0625rem] [overflow-clip-margin:2.5rem] [text-shadow:0_0_12px_var(--color-night-950)] wide:text-[1.125rem] min-[120rem]:text-[1.1875rem] ${japanese ? "font-ja leading-[1.95] font-medium [line-break:strict] [word-break:auto-phrase]" : "leading-[1.68]"}`}
        >
          {words.stanzas.map((stanza, index) => (
            <Dissolve
              key={stanza.lines[0] + index}
              order={Math.min(index, 5)}
              tracking={japanese ? 0.04 : 0}
            >
              <p
                className={
                  stanza.chorus ? "text-starlight-100" : "text-mauve-100"
                }
              >
                {stanza.lines.map((line, lineIndex) => (
                  <span
                    key={line + lineIndex}
                    className="block pl-[1em] -indent-[1em]"
                  >
                    {line}
                  </span>
                ))}
              </p>
            </Dissolve>
          ))}
        </div>
      </div>
    </div>
  );
}
