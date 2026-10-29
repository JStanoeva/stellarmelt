export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl px-6 py-4 text-center text-sm text-white/80">
          <p>
            © {currentYear} Stellarmelt • Built with ♥ in a galaxy of sound and
            glow.
          </p>
        </div>
      </div>
    </footer>
  );
}
