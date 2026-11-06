import { useState } from "react";

type Props = { title: string };

// The song's name: the old one stays underneath just long enough to cross-fade with the new one.
export default function RoomTitle({ title }: Props) {
  const [titles, setTitles] = useState({ now: title, before: "" });
  if (titles.now !== title) setTitles({ now: title, before: titles.now });

  return (
    <div
      aria-live="polite"
      className="relative text-center font-display text-sm font-medium tracking-[0.06em] whitespace-nowrap text-stardust-50/80 [text-shadow:0_0_12px_var(--color-night-950)]"
    >
      {titles.before && (
        <p
          key={`was-${titles.before}`}
          aria-hidden="true"
          className="room-title-out absolute inset-x-0 top-0"
        >
          {titles.before}
        </p>
      )}
      <p key={titles.now} className="room-title-in">
        {titles.now}
      </p>
    </div>
  );
}
