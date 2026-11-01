import type { Side } from "../../content/types";

type Props = { side: Side; className?: string };

// A constellation's name, set like a star chart's: spaced mono caps with the side's subtitle under it.
export default function SideLabel({ side, className = "" }: Props) {
  return (
    <p className={`[text-shadow:0_0_12px_var(--color-night-950)] ${className}`}>
      <span className="block font-mono text-[0.625rem] tracking-[0.16em] whitespace-nowrap text-starlight-200 uppercase wide:tracking-[0.3em]">
        <span className="text-rose-300">
          <span className="narrow:hidden">Side </span>
          {side.id}
        </span>{" "}
        · {side.name}
      </span>
      <span className="mt-1 block text-[0.75rem] whitespace-nowrap text-mauve-200 italic wide:text-[0.8125rem]">
        {side.subtitle}
      </span>
    </p>
  );
}
