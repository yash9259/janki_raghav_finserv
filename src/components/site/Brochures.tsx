import { useState } from "react";
import { motion } from "motion/react";
import { Search, Download, MapPin, Building2, Filter, X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

async function signedUrl(path: string | null): Promise<string> {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from("brochures").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? "";
}

async function signedDownloadUrl(path: string | null, filename: string): Promise<string> {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const safe = filename.replace(/[^a-z0-9._-]+/gi, "_") + ".pdf";
  const { data } = await supabase.storage
    .from("brochures")
    .createSignedUrl(path, 60 * 60, { download: safe });
  return data?.signedUrl ?? "";
}

const hues = [
  "from-amber-100 to-orange-200",
  "from-sky-100 to-indigo-200",
  "from-rose-100 to-pink-200",
  "from-emerald-100 to-teal-200",
  "from-violet-100 to-purple-200",
  "from-yellow-100 to-amber-200",
];
const filters = ["All", "Residential", "Commercial", "Luxury"];

export default function Brochures() {
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const [inquiry, setInquiry] = useState<null | { id: string; name: string; builder: string; pdf_path: string | null }>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["public-brochures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brochures")
        .select("id, name, builder, location, project_type, price, configs, image_url, pdf_url")
        .eq("status", "Published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      const withUrls = await Promise.all(
        rows.map(async (b) => ({
          ...b,
          image_signed: await signedUrl(b.image_url),
        }))
      );
      return withUrls;
    },
  });

  const list = rows.filter(d =>
    (f === "All" || d.project_type === f) &&
    d.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section id="brochures" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">
              <Building2 size={12} /> Builder Brochures
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">
              Explore premium <span className="text-gradient-gold">project brochures.</span>
            </h2>
            <p className="mt-3 text-brand-dark/60 max-w-xl">Pre-vetted residential, commercial and luxury properties with home-loan offers ready to go.</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 mb-8 border border-brand-dark/5">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 border border-brand-dark/8">
            <Search size={16} className="text-brand-dark/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by project name..." className="flex-1 bg-transparent outline-none text-sm text-brand-dark placeholder:text-brand-dark/40" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-brand-dark/40" />
            {filters.map(x => (
              <button key={x} onClick={() => setF(x)} className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${f===x ? "bg-brand-dark text-white" : "bg-white text-brand-dark/70 border border-brand-dark/10 hover:border-brand-dark/30"}`}>{x}</button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-3xl bg-white border border-brand-dark/8 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all shadow-soft"
            >
              <div className={`relative h-48 bg-gradient-to-br ${hues[i % hues.length]} overflow-hidden`}>
                {b.image_url ? (
                  <img src={b.image_signed || ""} alt={b.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 grid-bg opacity-30" />
                    <svg className="absolute inset-x-0 bottom-0" viewBox="0 0 400 120" preserveAspectRatio="none">
                      <path d="M0 80 L40 80 L40 40 L100 40 L100 60 L160 60 L160 20 L220 20 L220 50 L280 50 L280 30 L340 30 L340 70 L400 70 L400 120 L0 120 Z" fill="rgba(48,54,66,0.6)"/>
                      <path d="M0 95 L60 95 L60 65 L120 65 L120 80 L200 80 L200 55 L260 55 L260 75 L340 75 L340 60 L400 60 L400 120 L0 120 Z" fill="rgba(48,54,66,0.9)"/>
                    </svg>
                  </>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-bold uppercase tracking-wider text-brand-dark">{b.project_type}</div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand-gold text-[10px] font-bold uppercase tracking-wider text-brand-dark">New</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-brand-dark">{b.name}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-brand-dark/60">
                  <MapPin size={12} /> {b.location} · {b.builder}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-brand-dark/40">Configuration</div>
                    <div className="font-semibold text-brand-dark">{b.configs || "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-brand-dark/40">Starting</div>
                    <div className="font-semibold text-brand-dark">{b.price || "On request"}</div>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setInquiry({ id: b.id, name: b.name, builder: b.builder, pdf_path: b.pdf_url })}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-dark text-white text-xs font-semibold py-2.5 hover:bg-brand-dark/90"
                  >
                    <Download size={13} /> Download Brochure
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {!isLoading && list.length === 0 && (
          <div className="text-center py-16 text-brand-dark/50 text-sm">No brochures match your search.</div>
        )}
        {isLoading && (
          <div className="text-center py-16 text-brand-dark/50 text-sm">Loading projects…</div>
        )}
      </div>
      {inquiry && (
        <InquiryModal
          data={inquiry}
          onClose={() => setInquiry(null)}
        />
      )}
    </section>
  );

}

function InquiryModal({
  data,
  onClose,
}: {
  data: { id: string; name: string; builder: string; pdf_path: string | null };
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.address.trim()) {
      toast.error("Please fill in your name, phone, email and address.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name.trim().slice(0, 120),
      phone: form.phone.trim().slice(0, 30),
      email: form.email.trim().slice(0, 254),
      product: `Brochure — ${data.name}`,
      source: "brochure",
      message: `Requested brochure "${data.name}" by ${data.builder}. Action: Download PDF.\nAddress: ${form.address.trim()}`.slice(0, 2000),
    });
    if (error) {
      setSubmitting(false);
      toast.error("Could not submit. Please try again.");
      return;
    }
    const url = await signedDownloadUrl(data.pdf_path, data.name || "brochure");
    setSubmitting(false);
    if (!url) {
      toast.info("Our advisor will send the brochure shortly.");
      onClose();
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.name || "brochure").replace(/[^a-z0-9._-]+/gi, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Thanks! Your brochure is downloading.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brand-dark/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="gradient-dark text-white p-6 relative">
          <button aria-label="Close" onClick={onClose} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">
            <X size={16} />
          </button>
          <div className="text-xs uppercase tracking-[0.18em] text-brand-gold">Brochure request</div>
          <h3 className="mt-1.5 text-xl font-bold leading-tight">{data.name}</h3>
          <div className="text-xs text-white/60 mt-1">{data.builder}</div>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <p className="text-sm text-brand-dark/60">Share your details to instantly access the brochure. An advisor will follow up with best-fit loan options.</p>
          <div>
            <label className="text-xs font-semibold text-brand-dark/70">Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-brand-dark/10 px-4 py-2.5 text-sm outline-none focus:border-brand-gold" placeholder="Rahul Sharma" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-dark/70">Phone number</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-brand-dark/10 px-4 py-2.5 text-sm outline-none focus:border-brand-gold" placeholder="+91 98XXX XXXXX" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-dark/70">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-brand-dark/10 px-4 py-2.5 text-sm outline-none focus:border-brand-gold" placeholder="you@email.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-brand-dark/70">Address</label>
            <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1 w-full rounded-xl border border-brand-dark/10 px-4 py-2.5 text-sm outline-none focus:border-brand-gold resize-none" placeholder="City, area, pincode" />
          </div>
          <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-dark text-white font-semibold py-3 text-sm hover:bg-brand-dark/90 disabled:opacity-60">
            {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : <><Download size={14} /> Download PDF</>}
          </button>
          <p className="text-[10px] text-brand-dark/40 text-center">By submitting, you agree to be contacted by Janaki Raghav Finserve.</p>
        </form>
      </div>
    </div>
  );
}
