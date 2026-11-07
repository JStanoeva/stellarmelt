import { Link } from "react-router";
import { album } from "../content/album";
import { useIsPhone } from "../hooks/useIsPhone";
import { useKeepSongInSight } from "../hooks/useKeepSongInSight";
import { usePlayerView } from "../hooks/usePlayerView";
import { useShowArt } from "../hooks/useShowArt";
import { formatDate } from "../lib/dates";
import AlbumInfo from "../sections/discography/AlbumInfo";
import Legend from "../sections/discography/Legend";
import PhoneDiscography from "../sections/discography/phone/PhoneDiscography";
import SkyMap from "../sections/discography/SkyMap";
import TrackList from "../sections/discography/TrackList";

const released = formatDate(album.released);

// /discography: the sky map on top (the planet sinks lower to open the sky), then the album and its tracklist. Phones have their own calmer page.
export default function DiscographyPage() {
  useShowArt("contact");
  usePlayerView();
  const phone = useIsPhone();
  useKeepSongInSight(phone);
  if (phone) return <PhoneDiscography />;
  return (
    <div className="px-4 pt-[5.5rem] pb-20 wide:px-[clamp(1.25rem,3.4vw,3.5rem)] wide:pt-[clamp(5.5rem,12dvh,7.5rem)] wide:pb-28 short:pt-[3.75rem]">
      <title>Discography · Stellarmelt</title>
      <header className="mx-auto max-w-[78rem]">
        <Link
          to="/#discography"
          className="group inline-flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.2em] text-mauve-200 uppercase transition-colors duration-300 hover:text-starlight-100"
        >
          <span
            aria-hidden="true"
            className="text-rose-300 motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:-translate-x-1"
          >
            ←
          </span>
          Back to home
        </Link>
        <div className="mt-3 flex flex-col gap-3 wide:mt-2 wide:flex-row wide:items-end wide:justify-between wide:gap-10 short:mt-0 short:flex-row short:items-end short:justify-between short:gap-6">
          {/* The last term of each min() keeps the heading narrow enough for the album title to fit beside it. */}
          <h1
            tabIndex={-1}
            className="font-display text-[9vw] leading-[0.88] font-extrabold tracking-[-0.035em] text-stardust-50 wide:text-[min(clamp(3.5rem,6.2vw,6.5rem),11dvh,9.6vw_-_2.5rem)] short:text-[min(11dvh,10vw_-_2rem)]"
          >
            Discography
          </h1>
          <div className="flex flex-col gap-1 wide:shrink-0 wide:items-end wide:pb-1 wide:text-right short:shrink-0 short:items-end short:pb-1 short:text-right">
            <p className="font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase">
              Album · <time dateTime={album.released}>{released}</time>
            </p>
            <p className="font-display text-[1.5rem] leading-tight font-bold whitespace-nowrap text-stardust-50 xl:wide:text-[1.75rem] short:text-[1.25rem]">
              {album.title}
            </p>
            <Legend className="mt-2 narrow:hidden max-xl:hidden short:hidden" />
          </div>
        </div>
      </header>

      <section
        aria-labelledby="sky-title"
        className="mx-auto mt-8 max-w-[78rem] wide:mt-4 short:mt-4"
      >
        <h2 id="sky-title" className="sr-only">
          Song sky
        </h2>
        <SkyMap />
        {/* The key sits in the header only where the header has room for it. */}
        <Legend className="mt-10 wide:justify-center lg:wide:justify-start xl:wide:hidden short:flex short:justify-center" />
      </section>

      <div className="mx-auto mt-20 grid max-w-[78rem] grid-cols-[minmax(0,1fr)] gap-14 wide:mt-32 lg:wide:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] wide:gap-[clamp(3rem,6vw,6rem)]">
        <AlbumInfo className="lg:wide:sticky lg:wide:top-24 lg:wide:self-start" />
        <TrackList />
      </div>
    </div>
  );
}
