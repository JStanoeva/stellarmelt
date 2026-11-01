import { album, sides, tracks } from "../../content/album";
import { formatDate } from "../../lib/dates";
import AlbumCover from "./AlbumCover";
import SunoLink from "./SunoLink";

const released = formatDate(album.released);

type Props = { className?: string };

// The album's facts beside the tracklist: cover, title, release date, credits and its blurb.
export default function AlbumInfo({ className = "" }: Props) {
  return (
    <section aria-labelledby="album-title" className={className}>
      <AlbumCover className="block w-full max-w-[22rem] rounded-[4px] shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--color-rose-500)_45%,transparent)]" />
      <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase">
        Album
      </p>
      <h2
        id="album-title"
        className="mt-2 font-display text-[2rem] leading-[1.02] font-extrabold tracking-[-0.02em] text-stardust-50 wide:text-[2.25rem]"
      >
        {album.title}
      </h2>
      <p className="mt-2 text-[1.0625rem] text-mauve-100">{album.artist}</p>

      <dl className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2.5 font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
        <dt className="text-mauve-300">Released</dt>
        <dd className="text-starlight-100">
          <time dateTime={album.released}>{released}</time>
        </dd>
        <dt className="text-mauve-300">Songs</dt>
        <dd className="text-starlight-100">
          {tracks.length} · Sides {sides.map((side) => side.id).join(" & ")}
        </dd>
        <dt className="text-mauve-300">Credits</dt>
        <dd className="text-starlight-100">{album.credits}</dd>
      </dl>

      <SunoLink
        href={album.sunoUrl}
        label="Open the album on Suno"
        className="mt-4 text-rose-200"
      />

      <p className="mt-6 max-w-[40ch] text-[1rem] leading-[1.65] text-mauve-100">
        {album.blurb}
      </p>
    </section>
  );
}
