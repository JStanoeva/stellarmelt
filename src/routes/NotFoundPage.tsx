import { Link } from "react-router";
import { useShowArt } from "../hooks/useShowArt";

// The planet sits far off with its moon flung out of orbit.
export default function NotFoundPage() {
  useShowArt("notFound");

  return (
    <section
      aria-labelledby="not-found-title"
      className="flex min-h-dvh items-end px-5 pb-[11dvh] wide:items-center wide:pb-0 wide:pl-[clamp(5rem,12vw,12rem)]"
    >
      <title>Page not found · Stellarmelt</title>
      <div>
        <p className="font-mono text-[0.6875rem] tracking-[0.24em] text-rose-300 uppercase">
          404
        </p>
        <h1
          id="not-found-title"
          tabIndex={-1}
          className="mt-5 max-w-[9ch] font-display text-[14vw] leading-[0.9] font-extrabold tracking-[-0.035em] text-stardust-50 wide:text-[clamp(4.5rem,8vw,8rem)]"
        >
          Page not found
        </h1>
        <p className="mt-6 max-w-[30ch] text-[clamp(1.0625rem,2.4vw,1.3rem)] leading-[1.6] text-mauve-100 wide:text-[clamp(1.1rem,1.45vw,1.35rem)]">
          There’s no page at this address.
        </p>
        <p className="mt-9">
          <Link
            to="/"
            className="inline-block rounded-full bg-rose-300 px-6 py-3.5 text-[0.95rem] font-semibold text-night-950 transition-colors duration-300 hover:bg-rose-200"
          >
            Back to the home page
          </Link>
        </p>
      </div>
    </section>
  );
}
