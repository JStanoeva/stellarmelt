import BrandGlyph from "../../components/BrandGlyph";
import SiteFooter from "../../components/SiteFooter";
import { websiteCredit } from "../../content/homeSections";
import Dissolve from "../Dissolve";

// The end card's last lines: who made the website, apart from the band's channels, then the footer.
export default function SmallPrint() {
  return (
    <Dissolve
      order={4}
      tracking={0.22}
      className="mt-10 flex flex-col items-center gap-1 font-mono text-[0.6875rem] leading-[1.9] text-mauve-200 uppercase wide:mt-[clamp(2rem,5dvh,3rem)] short:mt-2 short:flex-row short:gap-6"
    >
      {/* The type size sits on the wrapper, so its tracking (in em) matches the small print, not 16 px. */}
      <p className="max-w-[30ch] wide:max-w-none">
        {websiteCredit.label} {websiteCredit.text}{" "}
        <a
          href={websiteCredit.href}
          target="_blank"
          rel="me noopener"
          className="inline-flex min-h-11 items-center gap-2 align-middle text-starlight-100 underline-offset-[0.5em] transition-colors duration-300 hover:text-rose-300 hover:underline wide:-my-2 wide:ml-1.5"
        >
          <BrandGlyph brand="github" className="size-3.5 shrink-0" />
          {websiteCredit.handle}
          <span aria-hidden="true">↗</span>
          <span className="sr-only">on GitHub (opens in a new tab)</span>
        </a>
      </p>
      <SiteFooter />
    </Dissolve>
  );
}
