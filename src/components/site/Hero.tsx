import { motion } from "motion/react";
import { ArrowRight, Calculator, ShieldCheck, TrendingUp, Sparkles, BadgeCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 gradient-radial-gold" />
      <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-dark/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-brand-dark shadow-soft"
            >
              <Sparkles size={14} className="text-brand-gold" />
              India's Trusted Loan & Insurance Advisory
              <span className="h-1 w-1 rounded-full bg-brand-dark/30" />
              ISO 9001:2015
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-dark leading-[1.05]"
            >
              Financial freedom,{" "}
              <span className="relative inline-block">
                <span className="text-gradient-gold">engineered</span>
                <svg viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full h-3" preserveAspectRatio="none">
                  <path d="M2 8 Q150 -2 298 6" stroke="#FFBD59" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <br />for ambitious lives.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 text-lg text-brand-dark/70 max-w-xl leading-relaxed"
            >
              From home loans to comprehensive insurance — get expert advisory, the lowest rates,
              and instant approvals from 180+ banking partners, all in one premium platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-dark/90 hover:shadow-xl transition-all">
                Apply Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#calculator" className="group inline-flex items-center gap-2 rounded-full glass border border-brand-dark/10 px-6 py-3.5 text-sm font-semibold text-brand-dark hover:bg-white transition-all">
                <Calculator size={16} className="text-brand-gold" />
                Calculate EMI
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              {[
                { icon: ShieldCheck, label: "RBI Registered" },
                { icon: BadgeCheck, label: "180+ Bank Partners" },
                { icon: TrendingUp, label: "₹280 Cr+ Disbursed" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2 text-sm text-brand-dark/70">
                  <t.icon size={16} className="text-brand-gold" />
                  <span className="font-medium">{t.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side: floating stat composition */}
          <div className="lg:col-span-5 relative h-[520px] hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0"
            >
              {/* Big dark card */}
              <div className="absolute top-0 right-0 w-[88%] h-[420px] rounded-[28px] gradient-dark p-7 shadow-2xl overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-gold/20 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/50">Portfolio Snapshot</div>
                    <div className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <div className="text-5xl font-bold text-white">₹48.2L</div>
                    <div className="text-sm font-semibold text-brand-gold">+12.4%</div>
                  </div>
                  <div className="mt-1 text-sm text-white/50">Total loan portfolio value</div>

                  {/* Fake chart */}
                  <div className="mt-8 h-32">
                    <svg viewBox="0 0 300 100" className="w-full h-full">
                      <defs>
                        <linearGradient id="cgrad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#FFBD59" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#FFBD59" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 80 L40 70 L80 75 L120 50 L160 55 L200 30 L240 35 L300 15 L300 100 L0 100 Z" fill="url(#cgrad)" />
                      <path d="M0 80 L40 70 L80 75 L120 50 L160 55 L200 30 L240 35 L300 15" stroke="#FFBD59" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      {[[40,70],[120,50],[200,30],[300,15]].map(([x,y]) => (
                        <circle key={x} cx={x} cy={y} r="3.5" fill="#FFBD59" stroke="#303642" strokeWidth="2" />
                      ))}
                    </svg>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { l: "Approved", v: "₹32L" },
                      { l: "Pending", v: "₹12L" },
                      { l: "Saved", v: "8.2%" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="text-[10px] uppercase tracking-wider text-white/40">{s.l}</div>
                        <div className="text-base font-bold text-white mt-1">{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating EMI card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 top-32 glass rounded-2xl p-4 shadow-soft w-56"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl gradient-gold grid place-items-center">
                    <Calculator size={18} className="text-brand-dark" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-brand-dark/50">EMI starting</div>
                    <div className="text-lg font-bold text-brand-dark">₹8,432<span className="text-xs font-medium text-brand-dark/60">/mo</span></div>
                  </div>
                </div>
              </motion.div>

              {/* Floating approved badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute left-4 bottom-4 glass rounded-2xl p-4 shadow-soft w-60"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-50 grid place-items-center">
                    <BadgeCheck size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-brand-dark/60">Loan Approved</div>
                    <div className="text-sm font-semibold text-brand-dark">HDFC • 8.45% p.a.</div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-brand-dark/10 overflow-hidden">
                  <div className="h-full w-[78%] gradient-gold" />
                </div>
                <div className="mt-1 text-[10px] text-brand-dark/50">Documents verified · Step 4 of 5</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
