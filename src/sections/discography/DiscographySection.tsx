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
      <div className="absolute inset-x-0 top-0 flex flex-col items-start pt-[4.75rem] pr-14 pl-5 wide:items-center wide:px-24 wide:pt-[clamp(4.5rem,10dvh,6rem)] wide:text-center">
        <Dissolve order={0} tracking={-0.035} loosen blur>
          <h2
            id="discography-title"
            data-stage-heading
            tabIndex={-1}
            className="font-display text-[8.2vw] leading-[0.9] font-extrabold text-stardust-50 wide:text-[min(clamp(3rem,5.6vw,6rem),10dvh)]"
          >
            Discography
          </h2>
        </Dissolve>
        <Dissolve order={1} className="mt-3 wide:mt-4">
          <p className="flex flex-col items-start gap-1 wide:flex-row wide:items-baseline wide:gap-4">
            <span className="font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase">
              Album · <time dateTime={album.released}>{released}</time>
            </span>
            <span className="font-display text-[1.5rem] leading-tight font-bold tracking-[-0.01em] text-stardust-50 wide:text-[clamp(1.5rem,2.3vw,2.25rem)]">
              {album.title}
            </span>
          </p>
        </Dissolve>
        <Dissolve order={2} className="mt-4 max-w-full wide:mt-5">
          <p className="flex max-w-full items-center gap-x-4 whitespace-nowrap wide:gap-x-6">
            <PlayButton
              track={current ?? tracks[0]}
              named
              className="narrow:px-4"
            />
            <Link
              to="/discography"
              className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] text-starlight-100 uppercase underline-offset-[0.6em] hover:underline wide:tracking-[0.22em]"
            >
              {/* Phones keep both on one line; a long title in the pill truncates instead. */}
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
      </div>

      <HomeSky className="absolute top-[33dvh] left-5 h-[31dvh] w-[min(100vw-4.5rem,19.5rem)] wide:top-[37dvh] wide:left-1/2 wide:h-[41dvh] wide:w-[min(100vw-7.5rem,136dvh)] wide:max-w-none wide:-translate-x-1/2" />

      <Dissolve
        order={4}
        className="absolute bottom-[3.5dvh] left-5 wide:left-1/2 wide:-translate-x-1/2"
      >
        <p className="flex gap-5 font-mono text-[0.625rem] tracking-[0.22em] whitespace-nowrap text-mauve-200 uppercase">
          <SingerMark singer="Tora" prefix="Sung by " />
          <SingerMark singer="Orion" prefix="Sung by " />
        </p>
      </Dissolve>
    </StageSection>
  );
}
