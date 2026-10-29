import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "timeline", label: "Timeline" },
    { id: "discography", label: "Discography" },
    { id: "contact", label: "Contact" },
  ];

  // Close mobile menu when viewport changes
  useEffect(() => {
    const onResize = () => setMenuOpen(false);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary"
          className="glass mt-4 flex items-center justify-between rounded-2xl px-4 py-3"
        >
          <a
            href="#hero"
            className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
            onClick={() => setMenuOpen(false)}
          >
            {/* Logo image */}
            <img
              src="/favicon.png"
              alt="Stellarmelt logo"
              className="h-7 w-7 object-contain select-none"
              draggable={false}
            />

            {/* Band name */}
            <span className="bg-gradient-to-r from-[#dd819c] via-[#a05987] to-[#3b1f52] bg-clip-text text-lg font-semibold tracking-wide text-transparent">
              Stellarmelt
            </span>
          </a>

          {/* Desktop menu */}
          <ul className="hidden items-center gap-6 text-sm md:flex">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="rounded-md px-2 py-1 opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="btn rounded-md p-2 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              )}
            </svg>
          </button>
        </nav>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="glass fade-in-up mt-2 rounded-xl px-4 py-3 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <ul className="flex flex-col gap-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dd819c]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
