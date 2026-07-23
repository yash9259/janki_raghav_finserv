import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Search, CreditCard, ArrowLeft, CheckCircle2, AlertCircle, Clock,
  FileText, ShieldCheck, LogIn, MessageSquare, BadgeCheck, Banknote, Wallet, XCircle,
} from "lucide-react";
import { trackByPan, type TrackedLead } from "@/lib/track.functions";
import logo from "@/assets/janaki-raghav-logo.png.asset.json";

export const Route = createFileRoute("/track")({
  component: TrackPage,
  head: () => ({
    meta: [
      { title: "Track your loan — Janaki Raghav Finserve" },
      { name: "description", content: "Track your loan application progress at Janaki Raghav Finserve using your registered phone number." },
    ],
  }),
});

export const STAGES = [
  { id: "Document Collected", icon: FileText },
  { id: "Cibil Check", icon: ShieldCheck },
  { id: "Login", icon: LogIn },
  { id: "Query", icon: MessageSquare },
  { id: "Sanctioned", icon: BadgeCheck },
  { id: "In Disbursement", icon: Banknote },
  { id: "Disbursed", icon: Wallet },
] as const;

const fmtINR = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

function TrackPage() {
  const track = useServerFn(trackByPan);
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrackedLead[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const p = sp.get("pan");
    if (p) {
      setPan(p.toUpperCase());
      (async () => {
        setLoading(true); setError(null);
        try { const r = await track({ data: { pan: p.toUpperCase() } }); setResults(r); }
        catch (err) { setError(err instanceof Error ? err.message : "Something went wrong"); }
        finally { setLoading(false); }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setResults(null);
    try {
      const r = await track({ data: { pan } });
      setResults(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-gold/5 via-white to-white">
      <header className="border-b border-brand-dark/5 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo.url} alt="Janaki Raghav Finserve" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <div className="font-bold text-brand-dark text-base">Janaki Raghav<span className="text-brand-gold">.</span></div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Finserve</div>
            </div>
          </Link>
          <Link to="/" className="text-xs font-semibold text-brand-dark/70 hover:text-brand-dark inline-flex items-center gap-1"><ArrowLeft size={12}/> Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-dark uppercase tracking-wider">
            <Clock size={12}/> Loan Tracker
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-brand-dark">
            Track your <span className="text-gradient-gold">application.</span>
          </h1>
          <p className="mt-3 text-brand-dark/60">Enter your PAN card number to see your live loan status.</p>
        </div>

        <form onSubmit={onSubmit} className="glass rounded-3xl p-5 md:p-7 shadow-soft border border-brand-dark/5 max-w-2xl mx-auto">
          <label className="block text-xs font-semibold text-brand-dark/70 mb-2 uppercase tracking-wider">PAN card number</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 rounded-2xl bg-white border border-brand-dark/10 px-4 py-3 focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20">
              <CreditCard size={16} className="text-brand-dark/40"/>
              <input
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                maxLength={10}
                placeholder="ABCDE1234F"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                className="flex-1 bg-transparent outline-none text-sm text-brand-dark placeholder:text-brand-dark/30 tracking-widest uppercase"
              />
            </div>
            <button type="submit" disabled={loading}
              className="inline-flex justify-center items-center gap-2 rounded-2xl bg-brand-dark text-white font-semibold px-6 py-3 text-sm hover:bg-brand-dark/90 disabled:opacity-60">
              <Search size={14}/> {loading ? "Searching…" : "Track now"}
            </button>
          </div>
          {error && <div className="mt-3 text-xs text-rose-600 inline-flex items-center gap-1.5"><AlertCircle size={12}/> {error}</div>}
        </form>

        {results && results.length === 0 && (
          <div className="mt-10 text-center text-brand-dark/60 text-sm">
            No application found for this PAN. Please check the number or call us at +91 93285 12413.
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-10 space-y-6">
            {results.map((lead) => <LeadStatusCard key={lead.id} lead={lead} />)}
          </div>
        )}
      </main>
    </div>
  );
}

function LeadStatusCard({ lead }: { lead: TrackedLead }) {
  const isRejected = lead.stage === "Rejected";
  const currentIdx = STAGES.findIndex(s => s.id === lead.stage);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-brand-dark/5 shadow-soft overflow-hidden">
      <div className="p-6 md:p-7 border-b border-brand-dark/5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-brand-dark/40">Application</div>
          <div className="mt-0.5 font-bold text-lg text-brand-dark">{lead.name}</div>
          <div className="text-xs text-brand-dark/50">#{lead.id.slice(0, 8).toUpperCase()} · {lead.product ?? "Loan"} · {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
        <div className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${isRejected ? "bg-rose-100 text-rose-700" : lead.stage === "Disbursed" ? "bg-emerald-100 text-emerald-700" : "bg-brand-gold/15 text-brand-dark"}`}>
          {lead.stage}
        </div>
      </div>

      {/* Loan details */}
      <div className="grid sm:grid-cols-3 gap-px bg-brand-dark/5">
        {[
          { l: "Loan Amount", v: lead.loan_amount ? `₹ ${fmtINR(lead.loan_amount)}` : (lead.amount ?? "—") },
          { l: "Interest Rate", v: lead.interest_rate ? `${lead.interest_rate.toFixed(2)} % p.a.` : "—" },
          { l: "Tenure", v: lead.tenure_years ? `${lead.tenure_years} Years` : "—" },
        ].map((d) => (
          <div key={d.l} className="bg-white p-5">
            <div className="text-[10px] uppercase tracking-wider text-brand-dark/40">{d.l}</div>
            <div className="mt-1 text-base font-bold text-brand-dark">{d.v}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="p-6 md:p-7">
        {isRejected ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 flex items-start gap-3">
            <XCircle size={20} className="text-rose-600 flex-shrink-0 mt-0.5"/>
            <div>
              <div className="text-sm font-bold text-rose-800">Application Rejected</div>
              <div className="mt-1 text-sm text-rose-700/90">{lead.rejection_reason || "Please contact us for the rejection reason."}</div>
            </div>
          </div>
        ) : (
          <ol className="relative space-y-5">
            {STAGES.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              const Icon = s.icon;
              return (
                <li key={s.id} className="flex items-start gap-4">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full grid place-items-center border-2 ${done ? "bg-emerald-500 border-emerald-500 text-white" : active ? "bg-brand-gold border-brand-gold text-brand-dark" : "bg-white border-brand-dark/15 text-brand-dark/30"}`}>
                      {done ? <CheckCircle2 size={18}/> : <Icon size={16}/>}
                    </div>
                    {i < STAGES.length - 1 && <div className={`absolute left-1/2 top-10 -translate-x-1/2 w-0.5 h-6 ${done ? "bg-emerald-500" : "bg-brand-dark/10"}`}/>}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className={`text-sm font-bold ${active ? "text-brand-dark" : done ? "text-emerald-700" : "text-brand-dark/40"}`}>{s.id}</div>
                    {active && s.id === "Query" && lead.query_note && (
                      <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                        <div className="font-bold uppercase tracking-wider text-[10px] mb-1">Query from advisor</div>
                        {lead.query_note}
                      </div>
                    )}
                    {active && s.id !== "Query" && (
                      <div className="text-xs text-brand-dark/50 mt-0.5">Currently in progress</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </motion.div>
  );
}