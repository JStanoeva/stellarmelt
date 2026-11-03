import { Link } from "react-router";
import PlayButton from "../../components/player/PlayButton";
import { album, tracks } from "../../content/album";
import { usePlayer } from "../../hooks/usePlayer";
import { usePlayerView } from "../../hooks/usePlayerView";
import { formatDate } from "../../lib/dates";
import Dissolve from "../Dissolve";
import StageSection from "../StageSection";
import HomeSky from "./HomeSky";
import SingerMark from "./SingerMark";

const released = formatDate(album.released);

// The album as two constellations over the planetrise; the pill plays “Melt”, or pauses and resumes the song that's on.
export default function DiscographySection() {
  usePlayerView();
  const { current } = usePlayer();
  return (
    <StageSection id="discography">
      {/* On tall screens the column ends at the planet's top edge (discographyY in src/art/poses.ts), and the sky fills what the copy leaves. */}
      <div className="absolute inset-x-0 top-0 flex h-[75dvh] flex-col items-start pt-[4.75rem] pr-14 pb-12 pl-5 wide:h-auto wide:items-center wide:px-24 wide:pt-[clamp(4.5rem,10dvh,6rem)] wide:pb-0 wide:text-center short:h-dvh short:items-center short:pt-[4.25rem] short:pr-12 short:pb-[calc(3.5dvh+1.75rem)] short:pl-12">
        {/* Landscape phones set the album beside the heading to leave the sky room. */}
        <div className="flex flex-col items-start wide:items-center short:flex-row short:items-center short:gap-4">
          <Dissolve order={0} tracking={-0.035} loosen blur>
            <h2
              id="discography-title"
              data-stage-heading
              tabIndex={-1}
              className="font-display text-[8.2vw] leading-[0.9] font-extrabold text-stardust-50 wide:text-[min(clamp(3rem,5.6vw,6rem),10dvh)] short:text-[min(2.5rem,10dvh,4.8vw)]"
            >
              Discography
            </h2>
          </Dissolve>
          <Dissolve order={1} className="mt-3 wide:mt-4 short:mt-0">
            <p className="flex flex-col items-start gap-1 wide:flex-row wide:items-baseline wide:gap-4 short:flex-col short:items-start short:gap-0.5 short:text-left">
              <span className="font-mono text-[0.6875rem] tracking-[min(0.24em,0.75vw)] text-rose-300 uppercase wide:tracking-[0.24em] short:tracking-[0.18em] short:whitespace-nowrap">
                Album · <time dateTime={album.released}>{released}</time>
              </span>
              <span className="font-display text-[clamp(1.25rem,6.2vw,1.5rem)] leading-tight font-bold tracking-[-0.01em] text-stardust-50 wide:text-[clamp(1.5rem,2.3vw,2.25rem)] short:text-[1.125rem]">
                {album.title}
              </span>
            </p>
          </Dissolve>
        </div>
        <Dissolve order={2} className="relative z-10 mt-4 max-w-full wide:mt-5 short:mt-3">
          <p className="flex max-w-full items-center gap-x-4 whitespace-nowrap wide:gap-x-6">
            <PlayButton
              track={current ?? tracks[0]}
              className="narrow:px-4"
            />
            <Link
              to="/discography"
              className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] text-starlight-100 uppercase underline-offset-[0.6em] hover:underline wide:tracking-[0.22em]"
            >
              {/* Phones keep both on one line. */}
              <span>
                <span className="narrow:hidden">Full </span>tracklist
              </span>
              <span
                aria-hidden="true"
                className="text-rose-300 motion-ok:transition-transform motion-ok:duration-300 motion-ok:group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </p>
        </Dissolve>

        {/* On short laptops the sky starts below the play button; on squarer screens it ends higher, so the arch's feet clear the planet. */}
        <HomeSky className="relative mt-5 min-h-0 w-full flex-1 wide:absolute wide:top-(--sky-top) wide:left-1/2 wide:mt-0 wide:h-[calc(var(--sky-end)_-_var(--sky-top))] wide:w-[min(100vw-7.5rem,max(136dvh,52rem))] wide:[--sky-end:min(78dvh,24vw_+_41dvh)] wide:[--sky-top:max(37dvh,16dvh_+_11rem)] wide:flex-none wide:-translate-x-1/2 short:relative short:top-auto short:left-auto short:mt-3 short:h-auto short:w-full short:flex-1 short:translate-x-0" />
      </div>

      <Dissolve
        order={4}
        className="absolute bottom-[3.5dvh] left-5 wide:left-1/2 wide:-translate-x-1/2 short:left-1/2 short:-translate-x-1/2"
      >
        <p className="flex gap-5 font-mono text-[0.625rem] tracking-[0.22em] whitespace-nowrap text-mauve-200 uppercase">
          <SingerMark singer="Tora" prefix="Sung by " />
          <SingerMark singer="Orion" prefix="Sung by " />
        </p>
      </Dissolve>
    </StageSection>
  );
}
