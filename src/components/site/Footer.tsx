import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/components/site/logo.png";

export default function Footer() {
  return (
    <footer className="gradient-dark text-white pt-20 pb-8 relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-brand-gold/8 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src= {logo} alt="Janaki Raghav Finserve" className="h-11 w-11 object-contain" />
              <div className="font-bold text-lg leading-tight">Janaki Raghav<span className="text-brand-gold">.</span>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/50 font-normal">Finserve</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-sm">
              Janaki Raghav Finserve is a trusted loan & insurance advisory based in Bhuj, Kachchh — helping families and businesses unlock smarter financial outcomes across Gujarat.
            </p>
            <ul className="mt-5 space-y-2.5 text-xs text-white/60">
              <li className="flex items-start gap-2"><MapPin size={13} className="text-brand-gold mt-0.5 flex-shrink-0"/> Office No. 15, Pankaj Complex, New Station Road, Bhuj (M+OG), Taluka Bhuj, District Kachchh, Gujarat</li>
              <li className="flex items-center gap-2"><Mail size={13} className="text-brand-gold"/> <a href="mailto:janakiraghavfin@gmail.com" className="hover:text-white">janakiraghavfin@gmail.com</a></li>
              <li className="flex items-center gap-2"><Phone size={13} className="text-brand-gold"/> <a href="tel:+919328512413" className="hover:text-white">+91 93285 12413</a></li>
            </ul>
            <div className="mt-5 flex gap-2">
              <a href="https://www.instagram.com/janakiraghavfinserve" target="_blank" rel="noreferrer" aria-label="Instagram" className="h-9 w-9 rounded-full bg-white/5 border border-white/10 grid place-items-center hover:bg-brand-gold hover:text-brand-dark hover:border-brand-gold transition-all">
                <Instagram size={14} />
              </a>
            </div>
          </div>

          <FCol title="Loans" links={["Home Loan","Loan Against Property","Car Loan","Business Loan","Personal Loan","Commercial Vehicle Loan"]} />
          <FCol title="Insurance" links={["Health Insurance","Term Life Insurance","Motor Insurance","Travel Insurance","Home Insurance"]} />
          <FCol title="Company" links={["About Us","Brochures","EMI Calculator","Careers","Privacy Policy","Terms of Service"]} />
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/45">
          <div>© {new Date().getFullYear()} Janaki Raghav Finserve · Bhuj, Kachchh, Gujarat</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-brand-gold">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(l => <li key={l}><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{l}</a></li>)}
      </ul>
    </div>
  );
}
