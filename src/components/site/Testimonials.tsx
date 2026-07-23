import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const items = [
  { name: "Aarav Mehta", role: "Home Loan Customer", text: "Janaki Raghav got me a rate 0.45% lower than what I'd been quoted directly by the bank. The advisor walked me through every step — felt like a private banker.", rating: 5, init: "AM" },
  { name: "Priya Sharma", role: "Business Loan", text: "Sanctioned ₹35 lakh in 4 working days without collateral. Their team handled all the paperwork — I just had to sign.", rating: 5, init: "PS" },
  { name: "Rohan Iyer", role: "Health Insurance", text: "Compared 9 plans on one screen and got cashless coverage activated for my family the same day. Outstanding service.", rating: 5, init: "RI" },
  { name: "Neha Kapoor", role: "Car Loan", text: "100% on-road financing on my new SUV at a fantastic rate. Janaki Raghav's relationship manager was always reachable.", rating: 5, init: "NK" },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = items[i];
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white to-brand-gold/[0.04]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">Testimonials</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">
            What our <span className="text-gradient-gold">clients</span> say.
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-stretch">
          {/* Featured */}
          <div className="lg:col-span-3 glass rounded-3xl p-8 md:p-12 shadow-soft border border-brand-dark/5 relative overflow-hidden">
            <Quote className="absolute top-6 right-6 text-brand-gold/15" size={120} />
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="relative"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={18} className="fill-brand-gold text-brand-gold" />)}
                </div>
                <p className="mt-5 text-xl md:text-2xl text-brand-dark leading-relaxed font-medium">"{t.text}"</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full gradient-gold grid place-items-center text-brand-dark font-bold text-lg shadow-gold">{t.init}</div>
                  <div>
                    <div className="font-semibold text-brand-dark">{t.name}</div>
                    <div className="text-xs text-brand-dark/60">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between">
              <div className="flex gap-1.5">
                {items.map((_, k) => (
                  <button key={k} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k===i ? "bg-brand-dark w-8" : "bg-brand-dark/20 w-4"}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setI((i-1+items.length)%items.length)} className="h-10 w-10 rounded-full border border-brand-dark/10 hover:bg-brand-dark hover:text-white grid place-items-center transition-colors"><ChevronLeft size={16} /></button>
                <button onClick={() => setI((i+1)%items.length)} className="h-10 w-10 rounded-full bg-brand-dark text-white hover:bg-brand-gold hover:text-brand-dark grid place-items-center transition-colors"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          {/* Side mini cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {items.filter((_, k) => k !== i).slice(0, 3).map((m) => (
              <div key={m.name} className="rounded-2xl bg-white border border-brand-dark/8 p-5 shadow-soft hover:shadow-xl transition-all">
                <div className="flex gap-0.5">
                  {Array.from({ length: m.rating }).map((_, k) => <Star key={k} size={12} className="fill-brand-gold text-brand-gold" />)}
                </div>
                <p className="mt-3 text-sm text-brand-dark/80 leading-relaxed line-clamp-3">"{m.text}"</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-brand-dark text-white grid place-items-center text-xs font-bold">{m.init}</div>
                  <div className="text-xs">
                    <div className="font-semibold text-brand-dark">{m.name}</div>
                    <div className="text-brand-dark/50">{m.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
