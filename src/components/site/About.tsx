import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Award, Users, Banknote, Building } from "lucide-react";

function useCounter(target: number, dur = 1500) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target, dur]);
  return { n, ref };
}

function Stat({ value, suffix, label, icon: Icon }: { value: number; suffix?: string; label: string; icon: any }) {
  const { n, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="inline-flex h-10 w-10 rounded-xl bg-brand-gold/15 text-brand-gold items-center justify-center mb-3">
        <Icon size={18} />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tight">{n.toLocaleString("en-IN")}{suffix}</div>
      <div className="mt-1 text-sm text-brand-dark/60">{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-brand-dark/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">About Janaki Raghav</div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">
              Six years of <span className="text-gradient-gold">trusted</span> financial advisory.
            </h2>
            <p className="mt-5 text-brand-dark/70 leading-relaxed">
              Since 2020, Janaki Raghav Finserve  has helped 460+ families and businesses unlock the right financial products
              at the right rates. We are a SEBI-aware, RBI-registered DSA partnered with India's leading public &
              private sector banks, NBFCs and insurance companies.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Curated offers from 180+ banks & NBFCs",
                "Dedicated relationship manager for every client",
                "Zero hidden charges — full rate-card transparency",
                "End-to-end documentation handled by experts",
              ].map(t => (
                <li key={t} className="flex items-start gap-3 text-sm text-brand-dark">
                  <span className="mt-1 h-5 w-5 rounded-full gradient-gold grid place-items-center text-brand-dark text-xs font-bold flex-shrink-0">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-5"
          >
            <div className="rounded-3xl bg-white p-7 shadow-soft border border-brand-dark/5">
              <Stat value={460} suffix="+" label="Happy customers" icon={Users} />
            </div>
            <div className="rounded-3xl gradient-dark p-7 text-white relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-gold/30 blur-3xl" />
              <div className="relative">
                <div className="inline-flex h-10 w-10 rounded-xl bg-white/10 items-center justify-center mb-3">
                  <Banknote size={18} className="text-brand-gold" />
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight"><CounterValue n={280} />+ Cr</div>
                <div className="mt-1 text-sm text-white/60">Disbursed in loans</div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-7 shadow-soft border border-brand-dark/5">
              <Stat value={180} suffix="+" label="Banking partners" icon={Building} />
            </div>
            <div className="rounded-3xl bg-white p-7 shadow-soft border border-brand-dark/5">
              <Stat value={6} suffix=" yrs" label="In business" icon={Award} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CounterValue({ n }: { n: number }) {
  const { n: c, ref } = useCounter(n);
  return <span ref={ref as any}>{c.toLocaleString("en-IN")}</span>;
}
