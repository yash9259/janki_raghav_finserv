import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  { q: "What documents do I need for a home loan application?", a: "PAN, Aadhaar, last 3 months' salary slips, last 6 months' bank statements, Form 16/ITR, and property documents. Our advisor sends a personalized checklist." },
  { q: "How long does loan approval typically take?", a: "In-principle approval in 24–48 hours. Final disbursement within 5–10 working days subject to property verification and legal clearance." },
  { q: "Is there any processing fee for using Janaki Raghav's services?", a: "Our advisory is free for borrowers — we are compensated by partner banks. You only pay the standard bank-level processing fee, never extra." },
  { q: "Can I prepay or foreclose my loan without penalty?", a: "Floating-rate home loans have zero foreclosure charges as per RBI. For other products, we negotiate the lowest possible prepayment terms upfront." },
  { q: "Which banks and NBFCs do you partner with?", a: "We work with 180+ lenders including HDFC, SBI, ICICI, Axis, Bajaj Finserv, Tata Capital, Kotak, and leading housing finance companies." },
  { q: "Are my personal documents safe with you?", a: "Yes — we use bank-grade 256-bit encryption, strict data-access controls, and never share your information without explicit consent." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">FAQ</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">Questions, <span className="text-gradient-gold">answered.</span></h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`rounded-2xl border transition-all ${isOpen ? "bg-white border-brand-gold/40 shadow-xl" : "bg-white border-brand-dark/8 hover:border-brand-dark/20"}`}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center gap-4 text-left p-5 md:p-6">
                  <div className={`h-9 w-9 rounded-full grid place-items-center flex-shrink-0 transition-all ${isOpen ? "gradient-gold text-brand-dark" : "bg-brand-dark/5 text-brand-dark"}`}>
                    {isOpen ? <Minus size={16}/> : <Plus size={16}/>}
                  </div>
                  <span className="flex-1 font-semibold text-brand-dark text-base md:text-lg">{f.q}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 md:px-8 pb-6 text-brand-dark/70 leading-relaxed pl-[4.25rem] md:pl-[4.5rem]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
