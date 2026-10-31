import { homeSections } from "../content/homeSections";

const pad = (value: number) => String(value).padStart(2, "0");

type Props = { index: number; className?: string };

// The poster's catalogue line, "02 / 05 —— About": decorative, because the dots already say where you are.
export default function SectionIndex({ index, className = "" }: Props) {
  return (
    <p
      aria-hidden="true"
      className={`flex items-center gap-3 font-mono text-[0.6875rem] uppercase ${className}`}
    >
      <span className="text-rose-300">
        {pad(index + 1)} / {pad(homeSections.length)}
      </span>
      <span className="h-px w-8 bg-mauve-300/60" />
      <span className="text-mauve-200">{homeSections[index].label}</span>
    </p>
  );
}
