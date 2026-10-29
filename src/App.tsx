import { useEffect } from "react";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import SkipLink from "./components/SkipLink";
import Starfield from "./components/Starfield";
import AboutSection from "./sections/about/AboutSection";
import ContactSection from "./sections/contact/ContactSection";
import DiscographySection from "./sections/discography/DiscographySection";
import HeroSection from "./sections/hero/HeroSection";
import TimelineSection from "./sections/timeline/TimelineSection";

export default function App() {
  // Scroll-reveal for About + Discography cards
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      "#about [data-reveal], #discography [data-reveal]",
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen text-white antialiased">
      {/* Animated background */}
      <div className="bg-cosmic fixed inset-0 -z-30" aria-hidden="true" />
      <Starfield />
      <SkipLink />
      <SiteHeader />

      <main className="pt-28 md:pt-32">
        <HeroSection />
        <AboutSection />
        <TimelineSection />
        <DiscographySection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
