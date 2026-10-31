import { firstEvent } from "../../content/homeSections";
import { formatDate } from "../../lib/dates";
import Dissolve from "../Dissolve";
import StageSection from "../StageSection";

// The planet shrinks to a distant point up high; its orbit opens into an arc that runs through the first event.
export default function TimelineSection() {
  return (
    <StageSection
      id="timeline"
      className="flex items-end px-5 pb-[10dvh] wide:pb-[13dvh] wide:pl-[clamp(5.5rem,12vw,12rem)]"
    >
      <div>
        <Dissolve order={0} tracking={-0.035} loosen blur>
          <h2
            id="timeline-title"
            data-stage-heading
            tabIndex={-1}
            className="font-display text-[12.2vw] leading-[0.9] font-extrabold text-stardust-50 wide:text-[clamp(4rem,8vw,7.5rem)]"
          >
            Timeline
          </h2>
        </Dissolve>
        <Dissolve order={1} tracking={0.2} loosen className="mt-8 wide:mt-10">
          <p className="flex items-center gap-3 font-mono text-[0.75rem] text-rose-300 uppercase">
            {/* The ring the moon comes to rest in: the orbit is pinned to this event. */}
            <span
              aria-hidden="true"
              data-orbit-anchor
              className="size-[1.375rem] shrink-0 rounded-full border border-rose-300/70"
            />
            {formatDate(firstEvent.date)}
          </p>
        </Dissolve>
        <Dissolve order={2} tracking={-0.01} className="mt-3">
          <h3 className="font-display text-[1.75rem] leading-tight font-bold text-stardust-50 wide:text-[clamp(1.9rem,2.6vw,2.6rem)]">
            {firstEvent.title}
          </h3>
        </Dissolve>
        <Dissolve order={3} className="mt-3">
          <p className="max-w-[36ch] text-[clamp(1.0625rem,2.4vw,1.3rem)] leading-[1.6] text-mauve-100 wide:text-[clamp(1.05rem,1.35vw,1.25rem)]">
            {firstEvent.summary}
          </p>
        </Dissolve>
      </div>
    </StageSection>
  );
}
