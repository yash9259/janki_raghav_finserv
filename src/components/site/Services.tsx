import { motion } from "motion/react";
import { Home, Building2, Truck, Car, Briefcase, User, HeartPulse, Shield, Bike, ArrowUpRight } from "lucide-react";

const services = [
  { icon: Home, name: "Home Loan", desc: "Own your dream home with rates from 7.25% p.a.", rate: "7.25%" },
  { icon: Building2, name: "Loan Against Property", desc: "Unlock equity from residential or commercial property.", rate: "8.50%" },
  { icon: Truck, name: "Commercial Vehicle", desc: "Finance trucks, buses & fleets with flexible tenures.", rate: "7.50%" },
  { icon: Car, name: "Car Loan", desc: "Drive home your new car with up to 100% on-road funding.", rate: "7.60%" },
  { icon: Briefcase, name: "Business Loan", desc: "Working capital up to ₹50L without collateral.", rate: "11.99%" },
  { icon: User, name: "Personal Loan", desc: "Instant approval in 24 hours, minimal documentation.", rate: "10.49%" },
  { icon: Shield, name: "Term Life Insurance", desc: "Comprehensive cover up to ₹2 Cr from top insurers.", rate: "₹490/mo" },
  { icon: Bike, name: "Motor Insurance", desc: "Two-wheeler & four-wheeler with zero-dep add-ons.", rate: "₹2,100/yr" },
  { icon: HeartPulse, name: "Health Insurance", desc: "Cashless treatment across 10,000+ network hospitals.", rate: "₹650/mo" },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" /> Our Services
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">
              Every financial product, <span className="text-gradient-gold">curated for you.</span>
            </h2>
          </div>
          <p className="text-brand-dark/60 max-w-md">
            Compare offers from 180+ lenders and 15+ insurance providers — handpicked, negotiated,
            and delivered through a single advisor.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative rounded-3xl bg-white border border-brand-dark/8 p-7 hover:border-brand-gold/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-soft overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-gold/0 group-hover:bg-brand-gold/15 blur-2xl transition-all duration-500" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-brand-dark/5 group-hover:gradient-gold group-hover:shadow-gold grid place-items-center transition-all">
                    <s.icon size={22} className="text-brand-dark" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-brand-dark/40">starting</div>
                    <div className="text-sm font-bold text-brand-dark">{s.rate}</div>
                  </div>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-brand-dark">{s.name}</h3>
                <p className="mt-2 text-sm text-brand-dark/60 leading-relaxed">{s.desc}</p>
                <div className="mt-6 pt-5 border-t border-brand-dark/8 flex items-center justify-between">
                  <a href="#contact" className="text-sm font-semibold text-brand-dark group-hover:text-brand-gold transition-colors inline-flex items-center gap-1.5">
                    Apply now
                    <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
                  </a>
                  <a href="#" className="text-xs text-brand-dark/50 hover:text-brand-dark">Learn more</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
