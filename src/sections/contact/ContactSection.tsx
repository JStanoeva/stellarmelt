export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold sm:text-4xl">Contact</h2>
        <div className="glass flex flex-col items-center rounded-2xl p-8">
          <p className="mb-6 text-center text-white/80">
            Follow Stellarmelt across the cosmos. Links will point to the
            official profiles soon—in the meantime, they orbit GitHub.
          </p>
          {/* TODO(Tora): the real Suno and YouTube profile URLs (Q-03) */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/JStanoeva"
              target="_blank"
              rel="noopener noreferrer"
              className="btn rounded-full p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-rose"
              aria-label="Spotify (placeholder link to GitHub)"
              title="Spotify"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm4.374 14.6a.75.75 0 0 1-1.035.249 11.55 11.55 0 0 0-5.683-1.529c-1.401 0-2.797.244-4.1.724a.75.75 0 1 1-.52-1.406 13.04 13.04 0 0 1 4.62-.817c2.21 0 4.364.533 6.27 1.539a.75.75 0 0 1 .248 1.24Zm1.38-3.002a.9.9 0 0 1-1.245.299c-2.02-1.24-4.57-1.94-7.21-1.94-1.616 0-3.22.233-4.72.69a.9.9 0 1 1-.53-1.72 16.4 16.4 0 0 1 5.25-.77c2.98 0 5.8.77 8.025 2.12a.9.9 0 0 1 .426 1.32Zm.397-3.146a1.05 1.05 0 0 1-1.45.373C14.47 9.55 12.32 9 10.02 9c-1.825 0-3.63.35-5.33 1.04a1.05 1.05 0 1 1-.776-1.952A17.9 17.9 0 0 1 10.02 7c2.7 0 5.24.61 7.41 1.82a1.05 1.05 0 0 1 .421 1.63Z" />
              </svg>
            </a>
            <a
              href="https://github.com/JStanoeva"
              target="_blank"
              rel="noopener noreferrer"
              className="btn rounded-full p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-rose"
              aria-label="YouTube (placeholder link to GitHub)"
              title="YouTube"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M23.5 6.7a4 4 0 0 0-2.8-2.8C18.9 3.4 12 3.4 12 3.4s-6.9 0-8.7.5A4 4 0 0 0 .5 6.7 41 41 0 0 0 0 12a41 41 0 0 0 .5 5.3 4 4 0 0 0 2.8 2.8c1.8.5 8.7.5 8.7.5s6.9 0 8.7-.5a4 4 0 0 0 2.8-2.8c.4-1.8.5-5.3.5-5.3s0-3.5-.5-5.3ZM9.8 15.6V8.4l6.6 3.6-6.6 3.6Z" />
              </svg>
            </a>
            <a
              href="https://github.com/JStanoeva"
              target="_blank"
              rel="noopener noreferrer"
              className="btn rounded-full p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-v1-rose"
              aria-label="Tidal (placeholder link to GitHub)"
              title="Tidal"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996 4.004 12l4.004-4.004L12.012 12l-4.004 4.004 4.004 4.004 4.004-4.004L12.012 12l4.004-4.004-4.004-4.004zM16.042 7.996l3.979-3.979L24 7.996l-3.979 3.979z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
