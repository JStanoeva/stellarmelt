import { useEffect, useState } from "react";
import { homeSections } from "../content/homeSections";

type Props = { activeIndex: number };

export default function DotNav({ activeIndex }: Props) {
  // A shown label may cover content, so Escape hides it until the pointer or focus reaches a dot again.
  const [labelsHidden, setLabelsHidden] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLabelsHidden(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed top-1/2 right-[clamp(0.125rem,1.3vw,1.5rem)] z-20 -translate-y-1/2"
    >
      <ol className="flex flex-col items-center">
        {homeSections.map((section, index) => {
          const active = index === activeIndex;
          return (
            <li key={section.id}>
              {/* A square 44 px target; the night ring under the focus outline keeps it visible over bright art. */}
              <a
                href={`#${section.id}`}
                aria-current={active ? "true" : undefined}
                onPointerEnter={() => setLabelsHidden(false)}
                onFocus={() => setLabelsHidden(false)}
                className="group relative grid size-11 place-items-center focus-visible:rounded-full focus-visible:shadow-[0_0_0_6px_var(--color-night-950)]"
              >
                {/* Its padding bridges the gap to the dot, so the pointer can move onto the label without losing it. */}
                <span
                  className={`pointer-events-none absolute inset-y-0 right-full flex items-center pr-3 opacity-0 transition-opacity duration-200 motion-ok:translate-x-1.5 motion-ok:transition-[opacity,translate] motion-ok:duration-300 motion-ok:group-hover:translate-x-0 motion-ok:group-focus-visible:translate-x-0 ${
                    labelsHidden
                      ? ""
                      : "group-hover:pointer-events-auto group-hover:opacity-100 group-focus-visible:opacity-100"
                  }`}
                >
                  <span className="flex items-center gap-2 rounded-full bg-night-950/90 py-1 pr-2 pl-2.5 font-mono text-[0.625rem] tracking-[0.24em] whitespace-nowrap text-starlight-100 uppercase">
                    <span aria-hidden="true" className="text-rose-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.label}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute size-[22px] rounded-full border border-rose-200/75 motion-ok:transition-[scale,opacity] motion-ok:duration-500 motion-ok:ease-condense ${
                    active ? "scale-100 opacity-100" : "scale-[0.35] opacity-0"
                  }`}
                >
                  <span
                    className={`absolute inset-[-1px] ${active ? "motion-ok:animate-orbit-once" : ""}`}
                  >
                    <span className="absolute -top-[2.5px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-starlight-100" />
                  </span>
                </span>
                {/* Forced colours drop backgrounds but paint borders, so the transparent border keeps the dot visible. */}
                <span
                  aria-hidden="true"
                  className={`rounded-full border-2 border-transparent motion-ok:transition-[width,height,background-color,scale] motion-ok:duration-500 motion-ok:ease-condense ${
                    active
                      ? "size-2 bg-rose-200 shadow-[0_0_0_2px_var(--color-night-950),0_0_8px_2px_color-mix(in_oklab,var(--color-rose-300)_55%,transparent)] motion-ok:animate-breathe"
                      : "size-1.5 bg-starlight-200/80 shadow-[0_0_0_2px_var(--color-night-950)] group-hover:scale-[1.35] group-hover:bg-starlight-100"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
