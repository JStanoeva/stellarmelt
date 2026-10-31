// Read once when the page loads, so rendering stays pure.
const year = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="font-mono text-[0.6875rem] text-mauve-200 uppercase">
      <p>© {year} Stellarmelt</p>
    </footer>
  );
}
