import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logo from "@/assets/janaki-raghav-logo.png.asset.json";

const links = [
  { href: "#services", label: "Services" },
  { href: "#calculator", label: "EMI Calculator" },
  { href: "#brochures", label: "Brochures" },
  { href: "#insurance", label: "Insurance" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg border-b border-brand-dark/5 py-2" : "bg-transparent py-5"
      }`}
    >
      <div className="w-full px-4 sm:px-8">
        <div className="flex items-center justify-between py-2">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={logo.url} alt="Janaki Raghav Finserve" className="h-11 w-11 object-contain drop-shadow-md" />
            <div className="leading-tight">
              <div className="font-bold text-brand-dark tracking-tight text-base sm:text-lg">Janaki Raghav<span className="text-brand-gold">.</span></div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Finserve</div>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm font-medium text-brand-dark/80 hover:text-brand-dark transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-3">
            <Link to="/track" className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark">Track Loan</Link>
            <Link to="/admin" className="text-sm font-medium text-brand-dark/70 hover:text-brand-dark">Admin</Link>
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 rounded-full bg-brand-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark/90 transition-all hover:shadow-lg"
            >
              Apply Now
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold group-hover:scale-150 transition-transform" />
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden p-2 text-brand-dark"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="xl:hidden mt-2 bg-white border border-brand-dark/5 rounded-2xl p-4 shadow-soft">
            <div className="flex flex-col">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-brand-dark/80 border-b border-brand-dark/5 last:border-0"
                >
                  {l.label}
                </a>
              ))}
              <Link to="/track" onClick={() => setOpen(false)} className="px-3 py-3 text-sm font-medium text-brand-dark/80 border-b border-brand-dark/5">Track Loan</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="px-3 py-3 text-sm font-medium text-brand-dark/80">Admin</Link>
              <a href="#contact" onClick={() => setOpen(false)} className="mt-2 inline-flex justify-center rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-white">
                Apply Now
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
