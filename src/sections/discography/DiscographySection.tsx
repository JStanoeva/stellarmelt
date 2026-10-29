import { album } from "../../content/albums";
import { songs } from "../../content/songs";
import TrackCard from "./TrackCard";

export default function DiscographySection() {
  return (
    <section id="discography" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Discography</h2>
          <p className="mt-2 text-white/80">
            <span className="font-semibold">Album:</span>{" "}
            <span className="bg-linear-to-r from-v1-rose to-v1-plum bg-clip-text text-transparent">
              {album.title}
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="glass h-full rounded-2xl p-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <img
                  src={album.cover}
                  alt={album.coverAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 30% 30%, rgba(221,129,156,.15) 0%, transparent 70%), radial-gradient(50% 60% at 70% 70%, rgba(160,89,135,.12) 0%, transparent 70%), linear-gradient(135deg, rgba(30,20,43,.10), rgba(59,31,82,.10))",
                  }}
                />
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold">{album.title}</h3>
                <p className="text-white/80">{album.blurb}</p>
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
            {songs.map((song, index) => (
              <TrackCard key={song.slug} song={song} index={index} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
