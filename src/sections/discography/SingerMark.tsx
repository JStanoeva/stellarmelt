import type { Singer } from "../../content/types";

const dot: Record<Singer, string> = {
  Tora: "bg-rose-300 shadow-[0_0_6px_1px_color-mix(in_oklab,var(--color-rose-400)_70%,transparent)]",
  Orion:
    "bg-starlight-100 shadow-[0_0_6px_1px_color-mix(in_oklab,var(--color-starlight-200)_70%,transparent)]",
};

type Props = { singer: Singer; prefix?: string };

// The singer in words, with the star colour the skies use for them.
export default function SingerMark({ singer, prefix = "" }: Props) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`size-1.5 shrink-0 rounded-full ${dot[singer]}`}
      />
      {prefix}
      {singer}
    </span>
  );
}
