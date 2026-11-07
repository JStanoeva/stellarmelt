import { useState } from "react";
import { album, sides, tracks } from "../../../content/album";
import { formatDate } from "../../../lib/dates";
import AlbumCover from "../AlbumCover";
import SunoLink from "../SunoLink";

const released = formatDate(album.released);

const term =
  "font-mono text-[0.6875rem] tracking-[0.14em] text-mauve-300 uppercase";

// Outlives the page, so Back from a song finds the fold as it was and lands on the same row.
let wasOpen = false;

// Everything else about the album stays folded until it's asked for; a details element brings the keyboard path with it.
export default function AlbumFold() {
  const [startOpen] = useState(wasOpen);

  return (
    <details
      open={startOpen}
      onToggle={(event) => {
        wasOpen = event.currentTarget.open;
      }}
      className="album-fold group/fold sky-rule"
    >
      <summary className="flex min-h-12 cursor-pointer items-center justify-between rounded-md font-mono text-[0.6875rem] tracking-[0.2em] text-mauve-200 uppercase transition-colors duration-300 hover:text-starlight-100 active:text-stardust-50">
        About the album
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="size-3 fill-none stroke-rose-300 stroke-[1.4] group-open/fold:rotate-45 motion-ok:transition-transform motion-ok:duration-300"
        >
          <path d="M6 1v10M1 6h10" />
        </svg>
      </summary>
      <div className="pt-2 pb-7">
        <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-start gap-4">
          <AlbumCover className="block w-full rounded-[4px]" />
          <dl className="grid gap-3 text-[0.875rem] leading-snug">
            <div>
              <dt className={term}>Released</dt>
              <dd className="mt-0.5 text-starlight-100">
                <time dateTime={album.released}>{released}</time>
              </dd>
            </div>
            <div>
              <dt className={term}>Songs</dt>
              <dd className="mt-0.5 text-starlight-100">
                {tracks.length} <span className="mx-0.5">·</span> Sides{" "}
                {sides.map((side) => side.id).join(" & ")}
              </dd>
            </div>
            <div>
              <dt className={term}>Credits</dt>
              <dd className="mt-0.5 text-starlight-100">{album.credits}</dd>
            </div>
          </dl>
        </div>
        <p className="mt-5 text-[1rem] leading-[1.6] text-mauve-100">
          {album.blurb}
        </p>
        <SunoLink
          href={album.sunoUrl}
          label="Open the album on Suno"
          className="mt-2 text-rose-200"
        />
      </div>
    </details>
  );
}
