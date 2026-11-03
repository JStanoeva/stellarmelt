import SingerMark from "./SingerMark";

type Props = { className?: string };

// The sky map's key: each singer's star colour.
export default function Legend({ className = "" }: Props) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.5625rem] tracking-[0.2em] text-mauve-200 uppercase ${className}`}
    >
      <SingerMark singer="Tora" prefix="Sung by " />
      <SingerMark singer="Orion" prefix="Sung by " />
    </p>
  );
}
