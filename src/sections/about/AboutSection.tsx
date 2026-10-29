import { members } from "../../content/members";
import MemberCard from "./MemberCard";

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h2 className="text-3xl font-bold sm:text-4xl">
            About{" "}
            <span className="bg-linear-to-r from-v1-rose to-v1-violet bg-clip-text text-transparent">
              Stellarmelt
            </span>
          </h2>
          <p className="mt-3 max-w-3xl text-white/80">
            Stellarmelt blends glassy minimalism with cosmic drama—crisp
            guitars, orchestral shadows, and vocals that gleam like
            constellations. It’s elegance in orbit: music to hold you when the
            universe feels big.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => (
            <MemberCard key={member.slug} member={member} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
