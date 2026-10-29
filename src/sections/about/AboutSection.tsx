import { members } from "../../content/members";

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h2 className="text-3xl font-bold sm:text-4xl">
            About{" "}
            <span className="bg-gradient-to-r from-[#dd819c] to-[#a05987] bg-clip-text text-transparent">
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
          {members.map((m, idx) => (
            <li
              key={m.name}
              className="group reveal"
              data-reveal
              style={{ transitionDelay: `${idx * 90}ms` }}
            >
              <div className="glass h-full rounded-2xl p-5 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/30">
                    <img
                      src="/favicon.png"
                      alt="Stellarmelt logo"
                      className="h-7 w-7 object-contain select-none"
                      draggable={false}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-sm text-white/70">{m.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-white/80">{m.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
