type Props = { icon: "play" | "pause"; className?: string };

// A triangle to play or resume, two bars to pause.
export default function PlayGlyph({ icon, className = "" }: Props) {
  if (icon === "pause") {
    return (
      <svg
        viewBox="0 0 10 10"
        aria-hidden="true"
        className={`shrink-0 fill-current ${className}`}
      >
        <rect width="3.6" height="10" rx="1.2" />
        <rect x="6.4" width="3.6" height="10" rx="1.2" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 10 12"
      aria-hidden="true"
      className={`shrink-0 fill-current ${className}`}
    >
      <path d="M0 0 10 6 0 12Z" />
    </svg>
  );
}
