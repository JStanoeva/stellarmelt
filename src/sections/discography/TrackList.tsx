import { sides } from "../../content/album";
import SideGlyph from "./SideGlyph";
import { sideTracks } from "./sky";
import TrackRow from "./TrackRow";

// The accessible default way to read the album: all sixteen songs in order, in their two sides.
export default function TrackList() {
  return (
    <section aria-labelledby="tracklist-title" className="@container">
      <h2
        id="tracklist-title"
        className="font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase"
      >
        Tracklist
      </h2>
      {sides.map((side) => {
        const songs = sideTracks(side.id);
        return (
          <div key={side.id} className="mt-10 first-of-type:mt-6">
            <div className="sky-rule flex flex-col-reverse items-start gap-4 pb-5 wide:flex-row wide:items-end wide:justify-between wide:gap-6">
              {/* In the wide row the side name scales with the tracklist's width (cqw) so it never runs into the glyph. */}
              <h3 className="min-w-0">
                <span className="block font-mono text-[0.6875rem] tracking-[0.24em] text-starlight-200 uppercase">
                  Side {side.id}
                </span>
                <span className="mt-1 block font-display text-[8.2vw] leading-[0.95] font-extrabold tracking-[-0.025em] text-stardust-50 wide:text-[min(3.25rem,(100cqw_-_8.5rem)/11.5)]">
                  {side.name}
                </span>
                <span className="mt-2 block text-[1rem] text-mauve-200 italic">
                  {side.subtitle}
                </span>
              </h3>
              <SideGlyph
                side={side.id}
                className="mb-1 h-14 w-auto shrink-0 wide:h-20"
              />
            </div>
            <ol start={songs[0].n}>
              {songs.map((track) => (
                <TrackRow key={track.slug} track={track} />
              ))}
            </ol>
          </div>
        );
      })}
    </section>
  );
}
