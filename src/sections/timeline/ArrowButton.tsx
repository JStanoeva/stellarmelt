type Props = {
  direction: 1 | -1;
  label: string;
  disabled: boolean;
  onClick: () => void;
};

// aria-disabled rather than disabled, so focus stays on the button when it reaches the end of the line.
export default function ArrowButton({ direction, label, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className="group grid size-11 shrink-0 place-items-center rounded-full border border-mauve-300/35 text-mauve-100 transition-colors duration-300 hover:border-rose-300/80 hover:text-rose-200 aria-disabled:cursor-default aria-disabled:border-mauve-300/15 aria-disabled:text-mauve-200/35"
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className={`size-4 fill-none stroke-current stroke-[1.5] ${direction < 0 ? "-scale-x-100" : ""}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 10h12.5M11 4.5l5.5 5.5-5.5 5.5" />
      </svg>
    </button>
  );
}
