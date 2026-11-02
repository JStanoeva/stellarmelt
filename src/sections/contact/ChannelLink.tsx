import BrandGlyph from "../../components/BrandGlyph";
import type { Channel } from "../../content/types";

type Props = { channel: Channel };

// A channel billed like a name in film credits: its mark, its name, its handle.
export default function ChannelLink({ channel }: Props) {
  return (
    // rel="me" ties the profile to this site; without noreferrer the platform still sees where the visit came from.
    <a
      href={channel.href}
      target="_blank"
      rel="me noopener"
      className="group flex min-w-[7.5rem] flex-col items-center gap-2 rounded-sm px-2 py-1.5 max-[24rem]:min-w-0 narrow:px-0 short:min-h-11 short:min-w-0 short:flex-row short:gap-2.5"
    >
      <BrandGlyph
        brand={channel.brand}
        className="size-5 text-rose-300 transition-transform duration-500 ease-(--ease-condense) motion-ok:group-hover:-translate-y-0.5 wide:size-6 short:size-4"
      />
      <span className="font-display text-[1.5rem] leading-none font-bold text-stardust-50 transition-colors duration-300 group-hover:text-rose-200 wide:text-[clamp(1.5rem,2.2vw,2rem)] short:text-[1.125rem]">
        {channel.name}
      </span>
      <span className="font-mono text-[0.625rem] tracking-[0.16em] whitespace-nowrap text-mauve-200 uppercase underline-offset-[0.5em] group-hover:underline max-[24rem]:tracking-[0.1em] wide:tracking-[0.22em] short:hidden">
        {channel.handle} <span aria-hidden="true">↗</span>
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
