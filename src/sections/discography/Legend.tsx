import SingerMark from "./SingerMark";

type Props = { className?: string };

// The sky map's key: each singer's star colour and the dotted line where an act ends.
export default function Legend({ className = "" }: Props) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.5625rem] tracking-[0.2em] text-mauve-200 uppercase ${className}`}
    >
      <SingerMark singer="Tora" prefix="Sung by " />
      <SingerMark singer="Orion" prefix="Sung by " />
      <span className="inline-flex items-center gap-2">
        <svg
          viewBox="0 0 24 4"
          aria-hidden="true"
          className="w-6 stroke-mauve-300"
          strokeLinecap="round"
          strokeWidth="1.6"
          strokeDasharray="0 6"
        >
          <line x1="2" y1="2" x2="24" y2="2" />
        </svg>
        An act ends
      </span>
    </p>
  );
}
