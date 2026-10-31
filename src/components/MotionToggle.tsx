type Props = { reduced: boolean; onToggle: () => void; className?: string };

// Pressed means motion is reduced; the little moon orbits only while motion is on.
export default function MotionToggle({
  reduced,
  onToggle,
  className = "",
}: Props) {
  return (
    <button
      type="button"
      aria-pressed={reduced}
      onClick={onToggle}
      className={`group inline-flex items-center gap-2.5 font-mono uppercase transition-colors duration-300 hover:text-starlight-100 aria-pressed:text-rose-300 ${className}`}
    >
      <span
        aria-hidden="true"
        className="relative grid size-3.5 place-items-center rounded-full border border-current"
      >
        <span className="size-1 rounded-full bg-current opacity-0 transition-opacity group-aria-pressed:opacity-100" />
        <span className="absolute inset-[-1px] motion-ok:animate-orbit">
          <span className="absolute -top-[3px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-rose-300 group-aria-pressed:opacity-0" />
        </span>
      </span>
      <span className="narrow:sr-only">Reduce motion</span>
    </button>
  );
}
