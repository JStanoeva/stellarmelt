import { Link } from "react-router";
import { useShowArt } from "../hooks/useShowArt";

// A page that crashes lands here, inside the layout, so the navbar and the planet stay.
export default function RouteErrorBoundary() {
  useShowArt("notFound");

  return (
    <section
      aria-labelledby="error-title"
      className="flex min-h-dvh items-end px-5 pb-[11dvh] wide:items-center wide:pb-0 wide:pl-[clamp(5rem,12vw,12rem)]"
    >
      <title>Something went wrong · Stellarmelt</title>
      <div>
        <h1
          id="error-title"
          tabIndex={-1}
          className="max-w-[12ch] font-display text-[11vw] leading-[0.9] font-extrabold tracking-[-0.035em] text-stardust-50 wide:text-[clamp(3.5rem,6vw,6rem)]"
        >
          Something went wrong
        </h1>
        <p className="mt-6 max-w-[30ch] text-[clamp(1.0625rem,2.4vw,1.3rem)] leading-[1.6] text-mauve-100 wide:text-[clamp(1.1rem,1.45vw,1.35rem)]">
          This page couldn’t load. Try reloading it.
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
