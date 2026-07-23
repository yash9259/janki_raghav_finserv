import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Calculator, TrendingUp, Wallet, PieChart } from "lucide-react";

const tabs = [
  { id: "home", label: "Home Loan", defaults: { amount: 5000000, rate: 8.4, tenure: 20 } },
  { id: "car", label: "Car Loan", defaults: { amount: 800000, rate: 8.75, tenure: 5 } },
  { id: "business", label: "Business Loan", defaults: { amount: 1500000, rate: 11.99, tenure: 3 } },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function EMICalculator() {
  const [tab, setTab] = useState(tabs[0]);
  const [amount, setAmount] = useState(tab.defaults.amount);
  const [rate, setRate] = useState(tab.defaults.rate);
  const [tenure, setTenure] = useState(tab.defaults.tenure);

  const setTabReset = (t: typeof tabs[0]) => {
    setTab(t); setAmount(t.defaults.amount); setRate(t.defaults.rate); setTenure(t.defaults.tenure);
  };

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const e = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const tp = e * n;
    return { emi: e, totalInterest: tp - amount, totalPayment: tp };
  }, [amount, rate, tenure]);

  // Donut math
  const principalPct = (amount / totalPayment) * 100;
  const C = 2 * Math.PI * 70;

  return (
    <section id="calculator" className="relative py-24 md:py-32 bg-gradient-to-b from-white via-brand-gold/5 to-white overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 rounded-full bg-brand-dark/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">
            <Calculator size={12} /> EMI Calculator
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">
            Plan your loan in <span className="text-gradient-gold">real time.</span>
          </h2>
          <p className="mt-4 text-brand-dark/60">
            Instantly calculate monthly EMIs, total interest, and amortization for home, car & business loans.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex glass rounded-full p-1.5 shadow-soft border border-brand-dark/5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTabReset(t)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all ${
                  tab.id === t.id
                    ? "bg-brand-dark text-white shadow-lg"
                    : "text-brand-dark/70 hover:text-brand-dark"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sliders */}
          <div className="lg:col-span-3 glass rounded-3xl p-7 md:p-9 shadow-soft border border-brand-dark/5">
            <div className="space-y-8">
              <SliderRow label="Loan Amount" value={`₹ ${fmt(amount)}`} min={100000} max={200000000} step={50000} v={amount} onChange={setAmount} suffix="₹20Cr" prefix="₹1L" unit="₹" />
              <SliderRow label="Interest Rate" value={`${rate.toFixed(2)} % p.a.`} min={6} max={20} step={0.05} v={rate} onChange={setRate} suffix="20%" prefix="6%" unit="% p.a." decimals={2} />
              <SliderRow label="Tenure" value={`${tenure} Years`} min={1} max={30} step={1} v={tenure} onChange={setTenure} suffix="30 Y" prefix="1 Y" unit="Years" />
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { icon: Wallet, label: "Principal", value: `₹${fmt(amount)}` },
                { icon: TrendingUp, label: "Interest", value: `₹${fmt(totalInterest)}` },
                { icon: PieChart, label: "Total", value: `₹${fmt(totalPayment)}` },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/60 border border-brand-dark/5 p-4">
                  <s.icon size={16} className="text-brand-gold" />
                  <div className="mt-2 text-[11px] uppercase tracking-wider text-brand-dark/50">{s.label}</div>
                  <div className="text-sm font-bold text-brand-dark mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Result card */}
          <motion.div
            key={`${amount}-${rate}-${tenure}-${tab.id}`}
            initial={{ scale: 0.98, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 rounded-3xl gradient-dark p-7 md:p-9 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-brand-gold/25 blur-3xl" />
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.18em] text-white/50">Your Monthly EMI</div>
              <div className="mt-2 text-5xl md:text-6xl font-bold text-gradient-gold leading-none">
                ₹{fmt(emi)}
              </div>
              <div className="mt-2 text-sm text-white/60">for {tab.label.toLowerCase()} of ₹{fmt(amount)} over {tenure} years</div>

              {/* Donut */}
              <div className="mt-8 flex items-center gap-6">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="14" fill="none" />
                  <circle
                    cx="80" cy="80" r="70"
                    stroke="#FFBD59" strokeWidth="14" fill="none"
                    strokeDasharray={C}
                    strokeDashoffset={C - (principalPct / 100) * C}
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                    style={{ transition: "stroke-dashoffset 0.4s ease" }}
                  />
                  <text x="80" y="76" textAnchor="middle" className="fill-white" fontSize="11" opacity="0.6">Principal</text>
                  <text x="80" y="94" textAnchor="middle" className="fill-white" fontSize="20" fontWeight="700">{Math.round(principalPct)}%</text>
                </svg>
                <div className="space-y-3 text-sm flex-1">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-brand-gold" />
                    <span className="text-white/70 flex-1">Principal</span>
                    <span className="font-semibold">₹{fmt(amount / 100000)}L</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-white/15" />
                    <span className="text-white/70 flex-1">Interest</span>
                    <span className="font-semibold">₹{fmt(totalInterest / 100000)}L</span>
                  </div>
                </div>
              </div>

              <a href="#contact" className="mt-8 inline-flex w-full justify-center rounded-full bg-brand-gold text-brand-dark font-semibold py-3.5 hover:shadow-gold transition-all">
                Apply for this loan
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SliderRow({ label, value, min, max, step, v, onChange, prefix, suffix, unit, decimals = 0 }: {
  label: string; value: string; min: number; max: number; step: number; v: number;
  onChange: (n: number) => void; prefix: string; suffix: string; unit?: string; decimals?: number;
}) {
  const pct = ((v - min) / (max - min)) * 100;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const [text, setText] = useState<string>(v.toFixed(decimals));
  useEffect(() => { setText(v.toFixed(decimals)); }, [v, decimals]);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm font-medium text-brand-dark/70">{label}</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={text}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              setText(raw);
              const n = parseFloat(raw);
              if (!isNaN(n) && n >= min && n <= max) onChange(n);
            }}
            onBlur={() => {
              const n = parseFloat(text);
              if (isNaN(n)) { setText(v.toFixed(decimals)); return; }
              const c = clamp(n);
              onChange(c);
              setText(c.toFixed(decimals));
            }}
            className="w-28 sm:w-32 rounded-xl bg-white border border-brand-dark/10 px-3 py-1.5 text-right text-sm font-bold text-brand-dark focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
          />
          {unit && <span className="text-xs font-semibold text-brand-dark/60 min-w-[2.5rem]">{unit}</span>}
        </div>
      </div>
      <div className="text-right text-[11px] text-brand-dark/40 -mt-2 mb-2">{value}</div>
      <div className="relative h-2 rounded-full bg-brand-dark/10">
        <div className="absolute inset-y-0 left-0 rounded-full gradient-gold" style={{ width: `${pct}%` }} />
        <input
          type="range" min={min} max={max} step={step} value={v}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div className="absolute top-1/2 -translate-y-1/2 -ml-2.5 h-5 w-5 rounded-full bg-white border-2 border-brand-gold shadow-md pointer-events-none" style={{ left: `${pct}%` }} />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-brand-dark/40">
        <span>{prefix}</span><span>{suffix}</span>
      </div>
    </div>
  );
}
