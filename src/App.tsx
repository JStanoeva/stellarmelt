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
  return (
    <div className="relative min-h-screen text-white antialiased">
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
