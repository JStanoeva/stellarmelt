type Props = { href: string; label?: string; className?: string };

// Suno opens in a new tab; the arrow shows it and the hidden note says it.
export default function SunoLink({
  href,
  label = "Open on Suno",
  className = "",
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.18em] whitespace-nowrap text-mauve-200 uppercase underline-offset-[0.5em] transition-colors duration-300 hover:text-starlight-100 hover:underline ${className}`}
    >
      {label} <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
