import { motion } from "motion/react";
import { HeartPulse, Car, ShieldCheck, ArrowUpRight, Award, Lock, Clock } from "lucide-react";

const plans = [
  { icon: HeartPulse, title: "Health Insurance", tag: "Most Popular", desc: "Cashless treatment at 10,000+ hospitals nationwide.", price: "₹650", bullets: ["₹5L–₹1Cr cover", "Pre & post hospitalization", "No claim bonus"], accent: "from-rose-500/10 to-rose-500/0" },
  { icon: Car, title: "Motor Insurance", tag: "Zero-Dep", desc: "Comprehensive cover for cars, bikes & commercial vehicles.", price: "₹2,100", bullets: ["Zero-depreciation cover", "24×7 roadside assistance", "Engine protection add-on"], accent: "from-sky-500/10 to-sky-500/0" },
  { icon: ShieldCheck, title: "Term Life Insurance", tag: "₹2 Cr Cover", desc: "Secure your family's future with high-cover plans.", price: "₹490", bullets: ["Cover up to ₹2 Cr", "Tax savings under 80C", "Critical illness rider"], accent: "from-emerald-500/10 to-emerald-500/0" },
];

export default function Insurance() {
  return (
    <section id="insurance" className="relative py-24 md:py-32 gradient-dark text-white overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.07]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-gold/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" /> Insurance
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Protect what matters most — with <span className="text-gradient-gold">peace of mind.</span>
          </h2>
          <p className="mt-4 text-white/60">Compare plans from 15+ trusted insurers and pick the perfect cover in minutes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-3xl glass-dark p-7 hover:bg-white/[0.08] transition-all hover:-translate-y-2 duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 grid place-items-center">
                    <p.icon size={22} className="text-brand-gold" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-wider">{p.tag}</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-white/60">{p.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gradient-gold">{p.price}</span>
                  <span className="text-sm text-white/50">/month onwards</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {p.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2 text-sm text-white/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" /> {b}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white text-brand-dark font-semibold py-3 text-sm hover:bg-brand-gold transition-colors group/btn">
                  Get a quote <ArrowUpRight size={14} className="group-hover/btn:rotate-45 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-14 grid sm:grid-cols-3 gap-4">
          {[
            { icon: Award, t: "IRDAI Authorized", d: "Licensed insurance broker" },
            { icon: Lock, t: "100% Data Secure", d: "Bank-grade encryption" },
            { icon: Clock, t: "24×7 Claim Support", d: "Dedicated claims team" },
          ].map(b => (
            <div key={b.t} className="flex items-center gap-4 rounded-2xl bg-white/[0.04] border border-white/10 p-4">
              <div className="h-11 w-11 rounded-xl bg-brand-gold/15 grid place-items-center text-brand-gold"><b.icon size={18} /></div>
              <div>
                <div className="font-semibold">{b.t}</div>
                <div className="text-xs text-white/55">{b.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
