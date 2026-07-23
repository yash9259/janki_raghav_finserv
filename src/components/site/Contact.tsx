import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", pan: "", product: "Home Loan", amount: "", message: "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in your name, phone, and email.");
      return;
    }
    const pan = form.pan.trim().toUpperCase();
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      toast.error("Please enter a valid 10-character PAN (e.g. ABCDE1234F).");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name, email: form.email, phone: form.phone,
      pan: pan || null,
      product: form.product, amount: form.amount || null,
      message: form.message || null, source: "Website", stage: "New",
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Enquiry submitted. Our advisor will contact you shortly.");
    setForm({ name: "", phone: "", email: "", pan: "", product: "Home Loan", amount: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-brand-dark/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">Contact</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">
            Let's start your <span className="text-gradient-gold">application.</span>
          </h2>
          <p className="mt-4 text-brand-dark/60">A relationship manager will reach out within 30 minutes during business hours.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-3 glass rounded-3xl p-7 md:p-10 shadow-soft border border-brand-dark/5 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name" placeholder="Aarav Mehta" value={form.name} onChange={(v) => set("name", v)} />
              <Field label="Phone number" placeholder="Contact number" type="tel" value={form.phone} onChange={(v) => set("phone", v)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Email" placeholder="you@email.com" type="email" value={form.email} onChange={(v) => set("email", v)} />
              <SelectField label="Service" value={form.product} onChange={(v) => set("product", v)}
                options={["Home Loan","Loan Against Property","Car Loan","Business Loan","Personal Loan","Health Insurance","Motor Insurance","Term Life Insurance"]} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="PAN card number" placeholder="ABCDE1234F" value={form.pan} onChange={(v) => set("pan", v.toUpperCase())} maxLength={10} />
              <Field label="Loan amount required" placeholder="₹ 25,00,000" value={form.amount} onChange={(v) => set("amount", v)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-dark/70 mb-2 uppercase tracking-wider">Message</label>
              <textarea rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us about your requirement…" className="w-full rounded-2xl bg-white border border-brand-dark/10 px-4 py-3 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all" />
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <label className="flex items-center gap-2 text-xs text-brand-dark/60">
                <input type="checkbox" defaultChecked className="rounded accent-brand-gold" />
                I agree to receive call/WhatsApp updates
              </label>
              <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-brand-dark text-white font-semibold px-6 py-3.5 text-sm hover:bg-brand-dark/90 hover:shadow-xl transition-all disabled:opacity-60">
                {busy ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : <>Submit enquiry <Send size={14} /></>}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl gradient-dark p-7 text-white relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-gold/30 blur-3xl" />
              <div className="relative space-y-5">
                <h3 className="font-bold text-xl">Reach us</h3>
                {[
                  { icon: Phone, l: "Phone", v: "+91 93285 12413" },
                  { icon: Mail, l: "Email", v: "janakiraghavfin@gmail.com" },
                  { icon: MapPin, l: "Office", v: "Office No. 15, Pankaj Complex, New Station Road, Bhuj (M+OG), Taluka Bhuj, District Kachchh, Gujarat" },
                  { icon: Clock, l: "Hours", v: "Mon–Sat · 10:00 AM – 8:00 PM" },
                ].map(c => (
                  <div key={c.l} className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center flex-shrink-0"><c.icon size={15} className="text-brand-gold" /></div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-white/50">{c.l}</div>
                      <div className="text-sm font-medium">{c.v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-brand-dark/8 shadow-soft h-56 relative bg-gradient-to-br from-brand-dark/5 to-brand-gold/10">
              <div className="absolute inset-0 grid-bg opacity-40" />
              {/* Fake map */}
              <svg viewBox="0 0 400 220" className="w-full h-full">
                <path d="M0 110 Q100 80 200 120 T400 100" stroke="#FFBD59" strokeWidth="3" fill="none" />
                <path d="M0 60 L80 90 L160 70 L240 100 L320 80 L400 110" stroke="#303642" strokeOpacity="0.3" strokeWidth="2" fill="none" />
                <circle cx="220" cy="110" r="18" fill="#FFBD59" fillOpacity="0.25">
                  <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="220" cy="110" r="8" fill="#303642" />
                <circle cx="220" cy="110" r="3" fill="#FFBD59" />
              </svg>
              <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-2 text-xs font-semibold text-brand-dark">📍 Bhuj, Kachchh HQ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text", value, onChange, maxLength }: { label: string; placeholder?: string; type?: string; value?: string; onChange?: (v: string) => void; maxLength?: number }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-brand-dark/70 mb-2 uppercase tracking-wider">{label}</label>
      <input type={type} placeholder={placeholder} maxLength={maxLength} value={value ?? ""} onChange={(e) => onChange?.(e.target.value)} className="w-full rounded-2xl bg-white border border-brand-dark/10 px-4 py-3 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all" />
    </div>
  );
}

function SelectField({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-brand-dark/70 mb-2 uppercase tracking-wider">{label}</label>
      <select value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full rounded-2xl bg-white border border-brand-dark/10 px-4 py-3 text-sm text-brand-dark focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
