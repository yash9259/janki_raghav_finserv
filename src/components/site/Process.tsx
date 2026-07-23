import { motion } from "motion/react";
import { FileText, FileSearch, CheckCircle2, Banknote } from "lucide-react";

const steps = [
  { icon: FileText, title: "Apply Online", desc: "Fill our 60-second pre-qualification form. No credit-score impact." },
  { icon: FileSearch, title: "Document Verification", desc: "Upload basic KYC; our experts verify and present matched offers." },
  { icon: CheckCircle2, title: "Approval", desc: "Get in-principle approval within 24-48 hours from top lenders." },
  { icon: Banknote, title: "Disbursement", desc: "Loan amount credited directly to your account — fast & secure." },
];

export default function Process() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">Loan Process</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">
            From application to <span className="text-gradient-gold">disbursement</span> in 4 steps.
          </h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-gold/30 via-brand-gold/60 to-brand-gold/30" />
          <div className="hidden lg:flex absolute top-12 left-[12%] right-[12%] -mt-[3px]">
            {[0,1,2,3].map(i => (
              <motion.div key={i} className="h-2 w-2 rounded-full bg-brand-gold mx-auto"
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative mx-auto h-24 w-24 rounded-3xl gradient-dark grid place-items-center text-white shadow-2xl mb-5">
                  <s.icon size={28} className="text-brand-gold" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full gradient-gold grid place-items-center text-brand-dark text-xs font-bold border-4 border-white">{i+1}</div>
                </div>
                <h3 className="text-lg font-bold text-brand-dark">{s.title}</h3>
                <p className="mt-2 text-sm text-brand-dark/60 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
