const paths = {
  play: "M8.5 5.5v13l10-6.5z",
  pause: "M9 5.5v13M15 5.5v13",
  previous: "M18 6.5v11l-8.5-5.5zM6 6.5v11",
  next: "M6 6.5v11l8.5-5.5zM18 6.5v11",
  back: "M19 12H5.5M11 6.5 5.5 12l5.5 5.5",
  fullscreen: "M5 9.5V5h4.5M19 9.5V5h-4.5M5 14.5V19h4.5M19 14.5V19h-4.5",
  "leave-fullscreen":
    "M9.5 5v4.5H5M14.5 5v4.5H19M9.5 19v-4.5H5M14.5 19v-4.5H19",
} as const;

type Props = { icon: keyof typeof paths; className?: string };

// The room's thin line glyphs, in the text colour; the control around each one names it.
export default function RoomGlyph({ icon, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[icon]} />
    </svg>
  );
}
