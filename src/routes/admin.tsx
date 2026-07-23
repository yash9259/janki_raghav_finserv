import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import logo from "@/assets/janaki-raghav-logo.png.asset.json";
import {
  LayoutDashboard, FileText, Users, Settings, LogOut, Bell, Search,
  Plus, Upload, Image as ImgIcon, MoreHorizontal, TrendingUp,
  Eye, Edit3, Trash2, ChevronDown, Building2, X, Percent, Save, Check, Copy,
  Mail, Phone, MessageCircle, Filter, ArrowUpRight, Shield, Globe, Palette, CreditCard, Lock,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Admin });

type Brochure = Tables<"brochures">;

type Rate = { id: string; name: string; min: number; max: number; processing: string; tenure: string; updated: string };
type LeadSummary = Pick<Tables<"leads">, "id" | "stage" | "source" | "product" | "loan_amount" | "created_at">;

type View = "dashboard" | "brochures" | "rates" | "leads" | "analytics" | "settings";

function Admin() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [leadSummaries, setLeadSummaries] = useState<LeadSummary[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [editBrochure, setEditBrochure] = useState<Brochure | null>(null);

  const adminName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";

  const formatDate = (value?: string | null) => value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const mapRate = (r: Tables<"interest_rates">): Rate => ({
    id: r.id,
    name: r.name,
    min: Number(r.min_roi),
    max: Number(r.max_roi),
    processing: r.processing,
    tenure: r.tenure,
    updated: formatDate(r.updated_at),
  });

  const loadAdminData = async () => {
    setDashboardLoading(true);
    const [brochureRes, rateRes, leadRes] = await Promise.all([
      supabase.from("brochures").select("*").order("created_at", { ascending: false }),
      supabase.from("interest_rates").select("*").order("sort_order", { ascending: true }),
      supabase.from("leads").select("id, stage, source, product, loan_amount, created_at").order("created_at", { ascending: false }),
    ]);

    if (brochureRes.error) toast.error(`Brochures: ${brochureRes.error.message}`);
    else setBrochures(brochureRes.data ?? []);

    if (rateRes.error) toast.error(`Interest rates: ${rateRes.error.message}`);
    else setRates((rateRes.data ?? []).map(mapRate));

    if (leadRes.error) toast.error(`Leads: ${leadRes.error.message}`);
    else setLeadSummaries((leadRes.data ?? []) as LeadSummary[]);

    setDashboardLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login", replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) void loadAdminData();
  }, [user]);

  const handleSaveBrochure = (b: Brochure) => {
    setBrochures((list) => list.some((x) => x.id === b.id) ? list.map((x) => (x.id === b.id ? b : x)) : [b, ...list]);
    setShowModal(false);
    setEditBrochure(null);
  };

  const handleDeleteBrochure = async (id: string) => {
    if (!confirm("Delete this brochure permanently?")) return;
    const previous = brochures;
    setBrochures((list) => list.filter((b) => b.id !== id));
    const { error } = await supabase.from("brochures").delete().eq("id", id);
    if (error) {
      setBrochures(previous);
      toast.error(error.message);
      return;
    }
    toast.success("Brochure deleted");
  };

  const activeLeads = leadSummaries.filter((l) => l.stage !== "Disbursed" && l.stage !== "Rejected").length;
  const brochureLeads = leadSummaries.filter((l) => l.source?.toLowerCase() === "brochure").length;
  const todayKey = new Date().toDateString();
  const leadsToday = leadSummaries.filter((l) => new Date(l.created_at).toDateString() === todayKey).length;
  const totalViews = brochures.reduce((sum, b) => sum + (b.views ?? 0), 0);

  if (authLoading || (!user && !authLoading)) {
    return <AdminLoading label="Checking admin access…" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-brand-dark flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-brand-dark text-white p-5 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <img src={logo.url} alt="Janaki Raghav Finserve" className="h-10 w-10 object-contain" />
          <div className="font-bold leading-tight">Janaki Raghav<span className="text-brand-gold">.</span>
            <div className="text-[10px] font-normal text-white/50 uppercase tracking-wider">Admin</div>
          </div>
        </Link>

        <nav className="flex-1 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" as const },
            { icon: FileText, label: "Brochures", id: "brochures" as const, badge: String(brochures.length) },
            { icon: Percent, label: "Interest Rates", id: "rates" as const, badge: String(rates.length) },
            { icon: Users, label: "Leads", id: "leads" as const, badge: "24" },
            { icon: TrendingUp, label: "Analytics", id: "analytics" as const },
            { icon: Settings, label: "Settings", id: "settings" as const },
          ].map(i => (
            <button
              key={i.label}
              onClick={() => setView(i.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                view === i.id ? "bg-brand-gold text-brand-dark" : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <i.icon size={16} />
              <span className="flex-1">{i.label}</span>
              {i.badge && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${view === i.id ? "bg-brand-dark text-brand-gold" : "bg-white/10"}`}>{i.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full gradient-gold grid place-items-center text-brand-dark font-bold text-sm">RS</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{adminName}</div>
              <div className="text-[11px] text-white/50">Admin</div>
            </div>
            <button onClick={() => signOut()} className="text-white/40 hover:text-white"><LogOut size={14} /></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2 max-w-md rounded-xl bg-slate-100 px-3 py-2">
            <Search size={15} className="text-slate-400" />
            <input placeholder="Search brochures, leads…" className="flex-1 bg-transparent outline-none text-sm" />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500">⌘K</kbd>
          </div>
          <button className="relative h-9 w-9 grid place-items-center rounded-xl hover:bg-slate-100">
            <Bell size={16} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-gold" />
          </button>
          {(view === "dashboard" || view === "brochures") && (
            <button onClick={() => { setEditBrochure(null); setShowModal(true); }} className="inline-flex items-center gap-2 rounded-xl bg-brand-dark text-white text-sm font-semibold px-4 py-2 hover:bg-brand-dark/90">
              <Plus size={14} /> Add Brochure
            </button>
          )}
        </header>

        <main className="p-6 space-y-6">
          {view === "rates" && (
            <RatesView rates={rates} setRates={setRates} />
          )}
          {view === "leads" && <LeadsView />}
          {view === "analytics" && <AnalyticsView brochures={brochures} leadSummaries={leadSummaries} />}
          {view === "settings" && <SettingsView adminName={adminName} adminEmail={user?.email ?? "janakiraghavfin@gmail.com"} />}

          {(view === "dashboard" || view === "brochures") && (
            <>
          {/* Page title */}
          <div>
            <div className="text-xs text-slate-500">Dashboard</div>
            <h1 className="text-2xl font-bold mt-0.5">Good morning, {adminName} 👋</h1>
            <p className="text-sm text-slate-500 mt-1">Live backend data for brochures, leads and interest rates.</p>
          </div>

          {/* KPI cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "Total Brochures", v: String(brochures.length), d: "Saved in backend", grad: "from-amber-50 to-amber-100" },
              { l: "Active Leads", v: String(activeLeads), d: `${leadsToday} new today`, grad: "from-blue-50 to-blue-100" },
              { l: "Brochure Views", v: totalViews.toLocaleString("en-IN"), d: "Total recorded views", grad: "from-emerald-50 to-emerald-100" },
              { l: "Brochure Leads", v: String(brochureLeads), d: "Inquiry form submissions", grad: "from-rose-50 to-rose-100" },
            ].map(k => (
              <div key={k.l} className={`rounded-2xl bg-gradient-to-br ${k.grad} border border-slate-200/60 p-5`}>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-slate-600">{k.l}</span>
                  {dashboardLoading && <Loader2 size={12} className="animate-spin text-slate-400" />}
                </div>
                <div className="mt-3 text-3xl font-bold">{k.v}</div>
                <div className="mt-1 text-xs text-slate-500">{k.d}</div>
              </div>
            ))}
          </div>

          {view === "dashboard" && (
            <>
          {/* Analytics + chart */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold">Brochure performance</h3>
                  <p className="text-xs text-slate-500">Live totals from saved brochure records</p>
                </div>
                <button onClick={loadAdminData} className="text-xs flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50">Refresh</button>
              </div>
              <div className="h-56">
                <svg viewBox="0 0 600 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#FFBD59" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FFBD59" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[40,80,120,160].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />)}
                  <path d="M0 150 L85 130 L170 140 L255 95 L340 110 L425 60 L510 75 L600 40 L600 200 L0 200 Z" fill="url(#ag)" />
                  <path d="M0 150 L85 130 L170 140 L255 95 L340 110 L425 60 L510 75 L600 40" stroke="#FFBD59" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M0 170 L85 165 L170 155 L255 145 L340 130 L425 120 L510 105 L600 95" stroke="#303642" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="6 4" />
                  {[[85,130],[255,95],[425,60],[600,40]].map(([x,y]) => (
                    <circle key={x} cx={x} cy={y} r="4" fill="#fff" stroke="#FFBD59" strokeWidth="2.5" />
                  ))}
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i) => (
                    <text key={d} x={i*85+30} y="195" textAnchor="middle" fontSize="10" fill="#94A3B8">{d}</text>
                  ))}
                </svg>
              </div>
              <div className="flex items-center gap-5 mt-4 text-xs">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-gold" /> Views <span className="text-slate-500">{totalViews.toLocaleString("en-IN")}</span></div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-dark" /> Brochure leads <span className="text-slate-500">{brochureLeads}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold">Top projects</h3>
              <p className="text-xs text-slate-500">By views this week</p>
              <div className="mt-5 space-y-4">
                {brochures.slice(0,4).map((b, i) => (
                  <div key={b.name} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-brand-gold/15 grid place-items-center text-brand-dark text-xs font-bold">{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{b.name}</div>
                      <div className="text-[11px] text-slate-500">{b.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{b.views.toLocaleString()}</div>
                      <div className="text-[10px] text-emerald-600">+12%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            </>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 border-b border-slate-200">
              <div>
                <h3 className="font-bold flex items-center gap-2"><Building2 size={16} className="text-brand-gold"/> All brochures</h3>
                <p className="text-xs text-slate-500">Manage your builder project brochures</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50">All status <ChevronDown size={12} /></button>
                <button onClick={() => { setEditBrochure(null); setShowModal(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-dark text-white text-xs font-semibold px-3 py-1.5"><Plus size={12} /> New</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="text-left font-semibold px-5 py-3">Project</th>
                    <th className="text-left font-semibold px-5 py-3">Builder</th>
                    <th className="text-left font-semibold px-5 py-3">Config / Price</th>
                    <th className="text-left font-semibold px-5 py-3">Possession</th>
                    <th className="text-left font-semibold px-5 py-3">Views</th>
                    <th className="text-left font-semibold px-5 py-3">Status</th>
                    <th className="text-right font-semibold px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardLoading && <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">Loading brochures…</td></tr>}
                  {!dashboardLoading && brochures.map(b => (
                    <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 grid place-items-center">
                            <Building2 size={16} className="text-brand-dark/60" />
                          </div>
                          <div>
                            <div className="font-semibold">{b.name}</div>
                            <div className="text-xs text-slate-500">{b.location} · {b.project_type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{b.builder}</td>
                      <td className="px-5 py-4 text-slate-600">
                        <div className="font-medium text-brand-dark">{b.price}</div>
                        <div className="text-xs text-slate-500">{b.configs}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{b.possession}</td>
                      <td className="px-5 py-4 font-medium">{b.views.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                          b.status === "Published" ? "bg-emerald-100 text-emerald-700" :
                          b.status === "Draft" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-200 text-slate-600"
                        }`}>{b.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button title="View" className="h-8 w-8 rounded-lg hover:bg-slate-100 grid place-items-center text-slate-500"><Eye size={14}/></button>
                          <button title="Edit" onClick={() => { setEditBrochure(b); setShowModal(true); }} className="h-8 w-8 rounded-lg hover:bg-slate-100 grid place-items-center text-slate-500"><Edit3 size={14}/></button>
                          <button title="Delete" onClick={() => handleDeleteBrochure(b.id)} className="h-8 w-8 rounded-lg hover:bg-rose-50 grid place-items-center text-rose-500"><Trash2 size={14}/></button>
                          <button className="h-8 w-8 rounded-lg hover:bg-slate-100 grid place-items-center text-slate-500"><MoreHorizontal size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!dashboardLoading && brochures.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">No brochures yet. Add your first builder brochure.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs text-slate-500">
              <div>Showing 1–{brochures.length} of {brochures.length} brochures</div>
              <div className="flex gap-1">
                <button className="px-3 py-1.5 rounded-lg bg-brand-dark text-white">Live</button>
              </div>
            </div>
          </div>
            </>
          )}
        </main>
      </div>

      {/* Add brochure modal */}
      {showModal && (
        <BrochureModal
          initial={editBrochure}
          onClose={() => { setShowModal(false); setEditBrochure(null); }}
          onSave={handleSaveBrochure}
        />
      )}
    </div>
  );
}

function AdminLoading({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-slate-50 text-brand-dark grid place-items-center">
      <div className="inline-flex items-center gap-2 text-sm text-slate-500"><Loader2 size={16} className="animate-spin" /> {label}</div>
    </div>
  );
}

function BrochureModal({ initial, onClose, onSave }: { initial: Brochure | null; onClose: () => void; onSave: (b: Brochure) => void }) {
  const [form, setForm] = useState<Brochure>(
    initial ?? {
      id: "", name: "", builder: "", location: "", project_type: "Residential", price: "",
      configs: "", possession: "", rera: "", pdf_url: null, image_url: null,
      views: 0, status: "Published", created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Brochure>(k: K, v: Brochure[K]) => setForm((f) => ({ ...f, [k]: v }));

  const uploadFile = async (file: File, folder: "pdf" | "images") => {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("brochures").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    return path;
  };

  const save = async () => {
    if (!form.name.trim() || !form.builder.trim() || !form.location.trim()) {
      toast.error("Project name, builder and location are required.");
      return;
    }
    setSaving(true);
    try {
      const pdfPath = pdfFile ? await uploadFile(pdfFile, "pdf") : form.pdf_url;
      const imagePath = imageFile ? await uploadFile(imageFile, "images") : form.image_url;
      const payload = {
        name: form.name.trim(),
        builder: form.builder.trim(),
        location: form.location.trim(),
        project_type: form.project_type || "Residential",
        price: form.price?.trim() || null,
        configs: form.configs?.trim() || null,
        possession: form.possession?.trim() || null,
        rera: form.rera?.trim() || null,
        pdf_url: pdfPath || null,
        image_url: imagePath || null,
        status: form.status || "Published",
        views: form.views ?? 0,
        updated_at: new Date().toISOString(),
      };

      const query = initial?.id
        ? supabase.from("brochures").update(payload).eq("id", initial.id).select("*").single()
        : supabase.from("brochures").insert(payload).select("*").single();
      const { data, error } = await query;
      if (error) throw error;
      toast.success(initial ? "Brochure updated" : "Brochure published");
      onSave(data as Brochure);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save brochure");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-lg">{initial ? "Edit brochure" : "Add new brochure"}</h3>
            <p className="text-xs text-slate-500">Builder project details, pricing, and PDF brochure.</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-lg hover:bg-slate-100 grid place-items-center"><X size={16}/></button>
        </div>
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <AField label="Project name" placeholder="Project name" value={form.name} onChange={(v) => set("name", v)} />
            <AField label="Builder / Developer" placeholder="Builder name" value={form.builder} onChange={(v) => set("builder", v)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AField label="Location" placeholder="City, area" value={form.location} onChange={(v) => set("location", v)} />
            <ASelect label="Project type" opts={["Residential", "Commercial", "Luxury", "Plotted", "Villas"]} value={form.project_type} onChange={(v) => set("project_type", v)} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <AField label="Starting price" placeholder="₹1.8 Cr" value={form.price ?? ""} onChange={(v) => set("price", v)} />
            <AField label="Configurations" placeholder="2, 3, 4 BHK" value={form.configs ?? ""} onChange={(v) => set("configs", v)} />
            <AField label="Possession" placeholder="Dec 2026" value={form.possession ?? ""} onChange={(v) => set("possession", v)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AField label="RERA number" placeholder="P52100012345" value={form.rera ?? ""} onChange={(v) => set("rera", v)} />
            <ASelect label="Status" opts={["Draft", "Published", "Archived"]} value={form.status ?? "Published"} onChange={(v) => set("status", v)} />
          </div>

          <UploadField icon={Upload} label="PDF Brochure" hint="Max file size 25 MB · PDF only" accept="application/pdf" file={pdfFile} existing={form.pdf_url} onFile={setPdfFile} />
          <UploadField icon={ImgIcon} label="Thumbnail image" hint="JPG/PNG · 1200×800 recommended" accept="image/*" file={imageFile} existing={form.image_url} onFile={setImageFile} />

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Cancel</button>
            <button disabled={saving} onClick={save} className="rounded-xl bg-brand-dark text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark/90 inline-flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} {saving ? "Saving…" : initial ? "Save changes" : "Publish brochure"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatesView({ rates, setRates }: { rates: Rate[]; setRates: (r: Rate[]) => void }) {
  const [draft, setDraft] = useState<Rate[]>(rates);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);

  useEffect(() => setDraft(rates), [rates]);

  const update = (id: string, patch: Partial<Rate>) => {
    setDraft((d) => d.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const saveRow = async (id: string) => {
    const row = draft.find((r) => r.id === id);
    if (!row) return;
    const timestamp = new Date().toISOString();
    const { error } = await supabase.from("interest_rates").update({
      min_roi: row.min,
      max_roi: row.max,
      processing: row.processing,
      tenure: row.tenure,
      updated_at: timestamp,
    }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    const today = new Date(timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const next = draft.map((r) => (r.id === id ? { ...r, updated: today } : r));
    setDraft(next);
    setRates(next);
    setSavedId(id);
    toast.success("Interest rate saved");
    setTimeout(() => setSavedId(null), 1500);
  };

  const saveAll = async () => {
    setSavingAll(true);
    const timestamp = new Date().toISOString();
    const { error } = await supabase.from("interest_rates").upsert(draft.map((r, index) => ({
      id: r.id,
      name: r.name,
      min_roi: r.min,
      max_roi: r.max,
      processing: r.processing,
      tenure: r.tenure,
      sort_order: index,
      updated_at: timestamp,
    })));
    setSavingAll(false);
    if (error) { toast.error(error.message); return; }
    const today = new Date(timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const next = draft.map((r) => ({ ...r, updated: today }));
    setDraft(next);
    setRates(next);
    toast.success("All interest rates saved");
  };

  return (
    <>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs text-slate-500">Loan products</div>
          <h1 className="text-2xl font-bold mt-0.5 flex items-center gap-2">
            <Percent size={20} className="text-brand-gold" /> Interest rates
          </h1>
          <p className="text-sm text-slate-500 mt-1">Update rate of interest, processing fees and tenure for every loan product.</p>
        </div>
        <button disabled={savingAll} onClick={saveAll} className="inline-flex items-center gap-2 rounded-xl bg-brand-dark text-white text-sm font-semibold px-4 py-2 hover:bg-brand-dark/90 disabled:opacity-60">
          {savingAll ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {savingAll ? "Saving…" : "Save all changes"}
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
          {draft.length > 0 && [
          { l: "Loan products", v: String(draft.length) },
          { l: "Lowest ROI", v: `${Math.min(...draft.map((r) => r.min)).toFixed(2)}%` },
          { l: "Highest ROI", v: `${Math.max(...draft.map((r) => r.max)).toFixed(2)}%` },
          ].map((k) => (
          <div key={k.l} className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="text-xs font-medium text-slate-600">{k.l}</div>
            <div className="mt-2 text-3xl font-bold text-brand-dark">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="font-bold">Rate sheet</h3>
          <p className="text-xs text-slate-500">Inline edit fields and save individually or all at once.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Loan product</th>
                <th className="text-left font-semibold px-5 py-3">Min ROI (% p.a.)</th>
                <th className="text-left font-semibold px-5 py-3">Max ROI (% p.a.)</th>
                <th className="text-left font-semibold px-5 py-3">Processing fee</th>
                <th className="text-left font-semibold px-5 py-3">Max tenure</th>
                <th className="text-left font-semibold px-5 py-3">Updated</th>
                <th className="text-right font-semibold px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {draft.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-brand-gold/15 grid place-items-center text-brand-dark font-bold text-xs">
                        {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div className="font-semibold">{r.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <NumInput value={r.min} step={0.05} onChange={(v) => update(r.id, { min: v })} />
                  </td>
                  <td className="px-5 py-3">
                    <NumInput value={r.max} step={0.05} onChange={(v) => update(r.id, { max: v })} />
                  </td>
                  <td className="px-5 py-3">
                    <TxtInput value={r.processing} onChange={(v) => update(r.id, { processing: v })} />
                  </td>
                  <td className="px-5 py-3">
                    <TxtInput value={r.tenure} onChange={(v) => update(r.id, { tenure: v })} />
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{r.updated}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => saveRow(r.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        savedId === r.id ? "bg-emerald-100 text-emerald-700" : "bg-brand-dark text-white hover:bg-brand-dark/90"
                      }`}
                    >
                      {savedId === r.id ? <><Check size={12}/> Saved</> : <><Save size={12}/> Save</>}
                    </button>
                  </td>
                </tr>
              ))}
              {draft.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">No interest rates found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function NumInput({ value, step, onChange }: { value: number; step: number; onChange: (n: number) => void }) {
  return (
    <input
      type="number"
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
    />
  );
}

function TxtInput({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-36 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
    />
  );
}

function AField({ label, placeholder, value, onChange }: { label: string; placeholder?: string; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"
      />
    </div>
  );
}
function ASelect({ label, opts, value, onChange }: { label: string; opts: string[]; value?: string; onChange?: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <select
        value={value ?? opts[0]}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none bg-white"
      >
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function UploadField({ icon: Icon, label, hint, accept, file, existing, onFile }: {
  icon: ComponentType<{ size?: number }>;
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  existing?: string | null;
  onFile: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <label className="block rounded-xl border-2 border-dashed border-slate-200 p-5 text-center hover:border-brand-gold/60 hover:bg-brand-gold/5 transition-colors cursor-pointer">
        <input type="file" accept={accept} className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        <div className="mx-auto h-10 w-10 rounded-xl bg-brand-gold/15 text-brand-dark grid place-items-center mb-2"><Icon size={18}/></div>
        <div className="text-sm font-semibold">{file ? file.name : existing ? "File already attached" : "Click to upload"} <span className="font-normal text-slate-500">{file ? "" : "or drag and drop"}</span></div>
        <div className="text-xs text-slate-500 mt-0.5">{hint}</div>
      </label>
    </div>
  );
}

/* -------------------- LEADS -------------------- */

type LeadStage =
  | "New"
  | "Document Collected"
  | "Cibil Check"
  | "Login"
  | "Query"
  | "Sanctioned"
  | "In Disbursement"
  | "Disbursed"
  | "Rejected";

const ALL_STAGES: LeadStage[] = [
  "New", "Document Collected", "Cibil Check", "Login", "Query",
  "Sanctioned", "In Disbursement", "Disbursed", "Rejected",
];

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string | null;
  product: string | null;
  amount: string | null;
  source: string;
  stage: string;
  query_note: string | null;
  rejection_reason: string | null;
  loan_amount: number | null;
  interest_rate: number | null;
  tenure_years: number | null;
  created_at: string;
  message?: string | null;
};

const stageStyle: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700",
  "Document Collected": "bg-sky-100 text-sky-700",
  "Cibil Check": "bg-indigo-100 text-indigo-700",
  "Login": "bg-violet-100 text-violet-700",
  "Query": "bg-amber-100 text-amber-700",
  "Sanctioned": "bg-teal-100 text-teal-700",
  "In Disbursement": "bg-cyan-100 text-cyan-700",
  "Disbursed": "bg-emerald-100 text-emerald-700",
  "Rejected": "bg-rose-100 text-rose-700",
};

function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setLeads((data ?? []) as Lead[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter(l =>
      (filter === "All" || l.stage === filter) &&
      (!q || l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.email || "").toLowerCase().includes(q) || (l.pan || "").toLowerCase().includes(q))
    );
  }, [leads, filter, search]);

  const updateStage = async (id: string, stage: string) => {
    setLeads(ls => ls.map(l => l.id === id ? { ...l, stage } : l));
    const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
    if (error) { toast.error(error.message); load(); }
    else toast.success(`Stage updated to ${stage}`);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    setLeads(ls => ls.filter(l => l.id !== id));
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) { toast.error(error.message); load(); }
    else toast.success("Lead deleted");
  };

  const copyTrackLink = (pan: string | null) => {
    if (!pan) { toast.error("Add a PAN number to this lead first"); return; }
    const url = `${window.location.origin}/track?pan=${pan.toUpperCase()}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Tracking link copied"));
  };

  const counts: Record<string, number> = {};
  ALL_STAGES.forEach(s => { counts[s] = leads.filter(l => l.stage === s).length; });

  return (
    <>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs text-slate-500">CRM</div>
          <h1 className="text-2xl font-bold mt-0.5 flex items-center gap-2"><Users size={20} className="text-brand-gold"/> Leads</h1>
          <p className="text-sm text-slate-500 mt-1">Track and qualify every enquiry across products. Add leads from outside sources here.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-xl bg-brand-dark text-white text-sm font-semibold px-4 py-2 hover:bg-brand-dark/90">
          <Plus size={14}/> Add new lead
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ALL_STAGES.slice(0, 5).map(s => (
          <div key={s} className="rounded-2xl bg-white border border-slate-200 p-4">
            <div className={`inline-block text-[10px] font-bold uppercase px-2 py-1 rounded-full ${stageStyle[s]}`}>{s}</div>
            <div className="mt-2 text-2xl font-bold">{counts[s]}</div>
            <div className="text-xs text-slate-500">in pipeline</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-1 max-w-md rounded-xl bg-slate-100 px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              placeholder="Search by name, phone or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...ALL_STAGES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full border transition-colors ${
                  filter === s ? "bg-brand-dark text-white border-brand-dark" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Lead</th>
                <th className="text-left font-semibold px-5 py-3">Contact</th>
                <th className="text-left font-semibold px-5 py-3">Product</th>
                <th className="text-left font-semibold px-5 py-3">Loan</th>
                <th className="text-left font-semibold px-5 py-3">Source</th>
                <th className="text-left font-semibold px-5 py-3">Stage</th>
                <th className="text-right font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">Loading leads…</td></tr>}
              {!loading && visible.map(l => (
                <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full gradient-gold grid place-items-center text-brand-dark font-bold text-xs">
                        {l.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div className="font-semibold">{l.name}</div>
                        <div className="text-[11px] text-slate-500">#{l.id.slice(0,8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5 text-xs"><Mail size={11}/> {l.email}</div>
                    <div className="flex items-center gap-1.5 text-xs mt-0.5"><Phone size={11}/> {l.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{l.product ?? "—"}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold">{l.loan_amount ? `₹${new Intl.NumberFormat("en-IN").format(l.loan_amount)}` : (l.amount ?? "—")}</div>
                    <div className="text-[11px] text-slate-500">{l.interest_rate ? `${Number(l.interest_rate).toFixed(2)}% · ${l.tenure_years ?? "—"} Y` : "—"}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{l.source}</td>
                  <td className="px-5 py-4">
                    <select value={l.stage} onChange={(e) => updateStage(l.id, e.target.value)}
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${stageStyle[l.stage] ?? "bg-slate-100 text-slate-600"}`}>
                      {ALL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button title="Edit / Process" onClick={() => setEditing(l)} className="h-8 w-8 rounded-lg hover:bg-slate-100 grid place-items-center text-slate-600"><Edit3 size={14}/></button>
                      <button title="Copy tracking link" onClick={() => copyTrackLink(l.pan)} className="h-8 w-8 rounded-lg hover:bg-amber-50 grid place-items-center text-amber-600"><Copy size={14}/></button>
                      <a title="Call" href={`tel:${l.phone}`} className="h-8 w-8 rounded-lg hover:bg-emerald-50 grid place-items-center text-emerald-600"><Phone size={14}/></a>
                      <a title="WhatsApp" target="_blank" rel="noreferrer" href={`https://wa.me/${l.phone.replace(/\D/g,"")}`} className="h-8 w-8 rounded-lg hover:bg-emerald-50 grid place-items-center text-emerald-600"><MessageCircle size={14}/></a>
                      <a title="Email" href={`mailto:${l.email}`} className="h-8 w-8 rounded-lg hover:bg-slate-100 grid place-items-center text-slate-500"><Mail size={14}/></a>
                      <button title="Delete" onClick={() => deleteLead(l.id)} className="h-8 w-8 rounded-lg hover:bg-rose-50 grid place-items-center text-rose-500"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && visible.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">No leads match your filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
      {editing && <EditLeadDrawer lead={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </>
  );
}

const PRODUCTS = ["Home Loan", "Loan Against Property", "Car Loan", "Business Loan", "Personal Loan", "Gold Loan", "Education Loan", "Health Insurance", "Motor Insurance", "Term Life Insurance"];
const SOURCES = ["Website", "WhatsApp", "Walk-in", "Referral", "Instagram", "Facebook", "Google Ads", "Phone Call", "Brochure", "Other"];

function AddLeadModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", pan: "", product: "Home Loan", source: "Walk-in",
    loan_amount: 5000000, interest_rate: 8.4, tenure_years: 20,
    stage: "New" as string, message: "",
  });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.phone) { toast.error("Name and phone are required"); return; }
    const pan = form.pan.trim().toUpperCase();
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      toast.error("PAN must be 10 chars (e.g. ABCDE1234F)"); return;
    }
    setBusy(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name, phone: form.phone, email: form.email || `${form.phone.replace(/\D/g,"")}@noemail.local`,
      pan: pan || null,
      product: form.product, source: form.source, stage: form.stage,
      loan_amount: form.loan_amount, interest_rate: form.interest_rate, tenure_years: form.tenure_years,
      amount: `₹${new Intl.NumberFormat("en-IN").format(form.loan_amount)}`,
      message: form.message || null,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead added"); onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-lg">Add new lead</h3>
            <p className="text-xs text-slate-500">Capture a lead from outside sources (walk-in, phone, referral, etc.)</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-lg hover:bg-slate-100 grid place-items-center"><X size={16}/></button>
        </div>
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <AField label="Full name *" value={form.name} onChange={(v) => set("name", v)} placeholder="Customer name"/>
            <AField label="Phone *" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+91 98XXX XXXXX"/>
            <AField label="Email" value={form.email} onChange={(v) => set("email", v)} placeholder="optional"/>
            <AField label="PAN card number" value={form.pan} onChange={(v) => set("pan", v.toUpperCase())} placeholder="ABCDE1234F"/>
            <ASelect label="Loan product" opts={PRODUCTS} value={form.product} onChange={(v) => set("product", v)}/>
            <ASelect label="Source" opts={SOURCES} value={form.source} onChange={(v) => set("source", v)}/>
            <ASelect label="Initial stage" opts={ALL_STAGES} value={form.stage} onChange={(v) => set("stage", v)}/>
          </div>

          <SliderInputRow label="Loan Amount" value={form.loan_amount} min={100000} max={200000000} step={50000} unit="₹" onChange={(v) => set("loan_amount", v)} prefix="₹1L" suffix="₹20Cr"/>
          <SliderInputRow label="Interest Rate" value={form.interest_rate} min={6} max={20} step={0.05} unit="% p.a." decimals={2} onChange={(v) => set("interest_rate", v)} prefix="6%" suffix="20%"/>
          <SliderInputRow label="Tenure" value={form.tenure_years} min={1} max={30} step={1} unit="Years" onChange={(v) => set("tenure_years", v)} prefix="1 Y" suffix="30 Y"/>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Notes</label>
            <textarea rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Internal notes about this lead…" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"/>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Cancel</button>
            <button disabled={busy} onClick={save} className="rounded-xl bg-brand-dark text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark/90 inline-flex items-center gap-2 disabled:opacity-60">
              <Save size={14}/> {busy ? "Saving…" : "Save lead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditLeadDrawer({ lead, onClose, onSaved }: { lead: Lead; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    stage: lead.stage,
    pan: lead.pan ?? "",
    query_note: lead.query_note ?? "",
    rejection_reason: lead.rejection_reason ?? "",
    loan_amount: lead.loan_amount ?? 5000000,
    interest_rate: lead.interest_rate ?? 8.4,
    tenure_years: lead.tenure_years ?? 20,
    product: lead.product ?? "Home Loan",
    source: lead.source,
  });
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    const pan = form.pan.trim().toUpperCase();
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      toast.error("PAN must be 10 chars (e.g. ABCDE1234F)"); return;
    }
    setBusy(true);
    const { error } = await supabase.from("leads").update({
      stage: form.stage,
      pan: pan || null,
      query_note: form.query_note || null,
      rejection_reason: form.stage === "Rejected" ? (form.rejection_reason || null) : null,
      loan_amount: form.loan_amount,
      interest_rate: form.interest_rate,
      tenure_years: form.tenure_years,
      product: form.product,
      source: form.source,
      amount: `₹${new Intl.NumberFormat("en-IN").format(form.loan_amount)}`,
    }).eq("id", lead.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Lead updated"); onSaved();
  };

  const panForLink = (form.pan || lead.pan || "").trim().toUpperCase();
  const trackUrl = typeof window !== "undefined" && panForLink
    ? `${window.location.origin}/track?pan=${panForLink}`
    : "";

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex justify-end" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white shadow-2xl w-full max-w-xl h-full overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-lg">Process: {lead.name}</h3>
            <p className="text-xs text-slate-500">{lead.phone} · {lead.email}</p>
          </div>
          <button onClick={onClose} className="h-9 w-9 rounded-lg hover:bg-slate-100 grid place-items-center"><X size={16}/></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-2xl bg-brand-gold/10 border border-brand-gold/30 p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-bold text-brand-dark/60">Customer tracking link</div>
              <div className="text-xs text-brand-dark truncate">{trackUrl || "Add PAN to generate link"}</div>
            </div>
            <button disabled={!trackUrl} onClick={() => { navigator.clipboard.writeText(trackUrl); toast.success("Copied"); }}
              className="text-xs font-bold rounded-lg bg-brand-dark text-white px-3 py-1.5 inline-flex items-center gap-1.5 disabled:opacity-50"><Copy size={12}/> Copy</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <AField label="PAN card number" value={form.pan} onChange={(v) => set("pan", v.toUpperCase())} placeholder="ABCDE1234F"/>
            <ASelect label="Loan product" opts={PRODUCTS} value={form.product} onChange={(v) => set("product", v)}/>
            <ASelect label="Source" opts={SOURCES} value={form.source} onChange={(v) => set("source", v)}/>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Loan process stage</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_STAGES.map(s => (
                <button key={s} onClick={() => set("stage", s)}
                  className={`text-[11px] font-semibold px-3 py-2 rounded-xl border transition-all ${
                    form.stage === s ? `${stageStyle[s]} border-current shadow-sm` : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          {form.stage === "Query" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Query details <span className="text-amber-600">(shown to customer)</span></label>
              <textarea rows={3} value={form.query_note} onChange={(e) => set("query_note", e.target.value)} placeholder="What document or info is needed?" className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"/>
            </div>
          )}

          {form.stage === "Rejected" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rejection reason <span className="text-rose-600">(shown to customer)</span></label>
              <textarea rows={3} value={form.rejection_reason} onChange={(e) => set("rejection_reason", e.target.value)} placeholder="Reason for rejection…" className="w-full rounded-xl border border-rose-200 bg-rose-50/30 px-3.5 py-2.5 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"/>
            </div>
          )}

          <SliderInputRow label="Loan Amount" value={form.loan_amount} min={100000} max={200000000} step={50000} unit="₹" onChange={(v) => set("loan_amount", v)} prefix="₹1L" suffix="₹20Cr"/>
          <SliderInputRow label="Interest Rate" value={form.interest_rate} min={6} max={20} step={0.05} unit="% p.a." decimals={2} onChange={(v) => set("interest_rate", v)} prefix="6%" suffix="20%"/>
          <SliderInputRow label="Tenure" value={form.tenure_years} min={1} max={30} step={1} unit="Years" onChange={(v) => set("tenure_years", v)} prefix="1 Y" suffix="30 Y"/>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Cancel</button>
            <button disabled={busy} onClick={save} className="rounded-xl bg-brand-dark text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark/90 inline-flex items-center gap-2 disabled:opacity-60">
              <Save size={14}/> {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderInputRow({ label, value, min, max, step, unit, decimals = 0, onChange, prefix, suffix }: {
  label: string; value: number; min: number; max: number; step: number; unit?: string;
  decimals?: number; onChange: (n: number) => void; prefix: string; suffix: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const display = unit === "₹" ? `₹ ${new Intl.NumberFormat("en-IN").format(Math.round(value))}` : `${value.toFixed(decimals)}${unit ? ` ${unit}` : ""}`;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <div className="flex items-center gap-2">
          <input type="number" min={min} max={max} step={step} value={Number(value.toFixed(decimals))}
            onChange={(e) => { const n = parseFloat(e.target.value); if (!isNaN(n)) onChange(clamp(n)); }}
            className="w-32 rounded-lg border border-slate-200 px-2.5 py-1.5 text-right text-sm font-bold focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none"/>
          {unit && <span className="text-[11px] font-semibold text-slate-500 min-w-[3rem]">{unit}</span>}
        </div>
      </div>
      <div className="text-right text-[10px] text-slate-400 mb-1.5">{display}</div>
      <div className="relative h-2 rounded-full bg-slate-100">
        <div className="absolute inset-y-0 left-0 rounded-full gradient-gold" style={{ width: `${pct}%` }}/>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"/>
        <div className="absolute top-1/2 -translate-y-1/2 -ml-2.5 h-5 w-5 rounded-full bg-white border-2 border-brand-gold shadow pointer-events-none" style={{ left: `${pct}%` }}/>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400"></div>
    </div>
  );
}

/* -------------------- ANALYTICS -------------------- */

function AnalyticsView({ brochures, leadSummaries }: { brochures: Brochure[]; leadSummaries: LeadSummary[] }) {
  const [range, setRange] = useState("30d");
  const ranges = [{ id: "7d", l: "7 days" }, { id: "30d", l: "30 days" }, { id: "90d", l: "90 days" }, { id: "1y", l: "1 year" }];
  const totalViews = brochures.reduce((sum, b) => sum + (b.views ?? 0), 0);
  const brochureLeads = leadSummaries.filter((l) => l.source?.toLowerCase() === "brochure").length;
  const disbursedLeads = leadSummaries.filter((l) => l.stage === "Disbursed");
  const conversion = leadSummaries.length ? ((disbursedLeads.length / leadSummaries.length) * 100).toFixed(1) : "0.0";
  const avgTicket = disbursedLeads.length
    ? Math.round(disbursedLeads.reduce((sum, l) => sum + (l.loan_amount ?? 0), 0) / disbursedLeads.length)
    : 0;
  const kpis = [
    { l: "Total leads", v: String(leadSummaries.length), d: "All saved inquiries" },
    { l: "Lead conversion", v: `${conversion}%`, d: `${disbursedLeads.length} disbursed leads` },
    { l: "Brochure leads", v: String(brochureLeads), d: "Inquiry form submissions" },
    { l: "Avg. loan ticket", v: avgTicket ? `₹${new Intl.NumberFormat("en-IN", { notation: "compact" }).format(avgTicket)}` : "₹0", d: "Disbursed leads" },
  ];
  const sourceCounts = leadSummaries.reduce<Record<string, number>>((acc, l) => {
    const key = l.source || "Other";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const colors = ["bg-brand-gold", "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-rose-500"];
  const sources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s, count], index) => ({
    s,
    v: leadSummaries.length ? Math.round((count / leadSummaries.length) * 100) : 0,
    c: colors[index] ?? "bg-slate-400",
  }));
  const productCounts = leadSummaries.reduce<Record<string, number>>((acc, l) => {
    const key = l.product || "General Inquiry";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const maxProduct = Math.max(1, ...Object.values(productCounts));
  const products = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({
    name,
    v: Math.round((count / maxProduct) * 100),
    pct: `${leadSummaries.length ? Math.round((count / leadSummaries.length) * 100) : 0}%`,
  }));
  return (
    <>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs text-slate-500">Insights</div>
          <h1 className="text-2xl font-bold mt-0.5 flex items-center gap-2"><TrendingUp size={20} className="text-brand-gold"/> Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Performance across traffic, leads and loan products.</p>
        </div>
        <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1">
          {ranges.map(r => (
            <button key={r.id} onClick={() => setRange(r.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                range === r.id ? "bg-brand-dark text-white" : "text-slate-600 hover:bg-slate-50"
              }`}>{r.l}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.l} className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">{k.l}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"><ArrowUpRight size={10}/>Live</span>
            </div>
            <div className="mt-3 text-3xl font-bold text-brand-dark">{k.v}</div>
            <div className="mt-1 text-xs text-slate-500">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold">Traffic & leads trend</h3>
          <p className="text-xs text-slate-500 mb-4">Lead activity and brochure interest</p>
          <div className="h-64">
            <svg viewBox="0 0 600 220" className="w-full h-full">
              <defs>
                <linearGradient id="vg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FFBD59" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#FFBD59" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[40,80,120,160].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="4 4"/>)}
              <path d="M0 170 L60 150 L120 160 L180 110 L240 120 L300 70 L360 95 L420 55 L480 85 L540 40 L600 60 L600 220 L0 220 Z" fill="url(#vg)"/>
              <path d="M0 170 L60 150 L120 160 L180 110 L240 120 L300 70 L360 95 L420 55 L480 85 L540 40 L600 60" stroke="#FFBD59" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M0 190 L60 185 L120 175 L180 165 L240 155 L300 145 L360 140 L420 125 L480 130 L540 115 L600 105" stroke="#303642" strokeWidth="2.5" fill="none" strokeDasharray="6 4"/>
            </svg>
          </div>
          <div className="flex items-center gap-5 text-xs mt-2">
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-gold"/> Brochure views: {totalViews.toLocaleString("en-IN")}</div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-dark"/> Leads: {leadSummaries.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold">Traffic sources</h3>
          <p className="text-xs text-slate-500 mb-4">Share of total leads</p>
          <div className="space-y-3">
            {sources.map(s => (
              <div key={s.s}>
                <div className="flex justify-between text-xs mb-1"><span className="font-medium">{s.s}</span><span className="text-slate-500">{s.v}%</span></div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${s.c}`} style={{ width: `${s.v}%` }}/>
                </div>
              </div>
            ))}
            {sources.length === 0 && <div className="text-sm text-slate-400 py-8 text-center">No source data yet.</div>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-bold">Top loan products by interest</h3>
        <p className="text-xs text-slate-500 mb-4">Based on enquiries this period</p>
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.name} className="flex items-center gap-4">
              <div className="w-44 text-sm font-medium">{p.name}</div>
              <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full gradient-gold" style={{ width: `${p.v}%` }}/>
              </div>
              <div className="w-20 text-right text-sm font-semibold">{p.pct}</div>
            </div>
          ))}
          {products.length === 0 && <div className="text-sm text-slate-400 py-8 text-center">No product data yet.</div>}
        </div>
      </div>
    </>
  );
}

/* -------------------- SETTINGS -------------------- */

function SettingsView({ adminName, adminEmail }: { adminName: string; adminEmail: string }) {
  const [tab, setTab] = useState<"profile" | "company" | "notifications" | "appearance" | "billing" | "security">("profile");
  const tabs = [
    { id: "profile" as const, l: "Profile", icon: Users },
    { id: "company" as const, l: "Company", icon: Building2 },
    { id: "notifications" as const, l: "Notifications", icon: Bell },
    { id: "appearance" as const, l: "Appearance", icon: Palette },
    { id: "billing" as const, l: "Billing", icon: CreditCard },
    { id: "security" as const, l: "Security", icon: Lock },
  ];
  return (
    <>
      <div>
        <div className="text-xs text-slate-500">Account</div>
        <h1 className="text-2xl font-bold mt-0.5 flex items-center gap-2"><Settings size={20} className="text-brand-gold"/> Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your profile, company information and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="bg-white rounded-2xl border border-slate-200 p-3 h-fit">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-brand-gold/15 text-brand-dark" : "text-slate-600 hover:bg-slate-50"
                }`}>
                <t.icon size={15}/> {t.l}
              </button>
            ))}
          </nav>
        </aside>

        <section className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          {tab === "profile" && (
            <>
              <SectionHead title="Profile" subtitle="Update your personal information." />
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl gradient-gold grid place-items-center text-brand-dark font-bold text-xl">JR</div>
                <div>
                  <button className="rounded-xl bg-brand-dark text-white text-xs font-semibold px-3 py-1.5 mr-2">Upload new</button>
                  <button className="rounded-xl border border-slate-200 text-xs font-semibold px-3 py-1.5">Remove</button>
                  <div className="text-[11px] text-slate-500 mt-1.5">JPG/PNG · max 2MB</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <AField label="Full name" value={adminName} />
                <AField label="Designation" value="Admin" />
                <AField label="Email" value={adminEmail} />
                <AField label="Phone" value="+91 93285 12413" />
              </div>
              <SaveRow />
            </>
          )}
          {tab === "company" && (
            <>
              <SectionHead title="Company" subtitle="Public details shown on invoices and the website." />
              <div className="grid sm:grid-cols-2 gap-4">
                <AField label="Legal name" value="Janaki Raghav Finserve" />
                <AField label="Brand name" value="Janaki Raghav" />
                <AField label="GSTIN" value="27ABCDE1234F1Z5" />
                <AField label="PAN" value="ABCDE1234F" />
                <AField label="Support email" value="janakiraghavfin@gmail.com" />
                <AField label="Support phone" value="+91 93285 12413" />
              </div>
              <AField label="Registered address" value="Bhuj, Kachchh, Gujarat" />
              <SaveRow />
            </>
          )}
          {tab === "notifications" && (
            <>
              <SectionHead title="Notifications" subtitle="Decide when and how the team is alerted." />
              <div className="space-y-2">
                <ToggleRow label="New lead submitted" hint="Email + push when a website form is submitted" defaultOn/>
                <ToggleRow label="Brochure downloaded" hint="Daily digest of all brochure downloads" defaultOn/>
                <ToggleRow label="Loan EMI calculator used" hint="Notify when high-value calculations happen" />
                <ToggleRow label="Weekly performance report" hint="Every Monday 9 AM" defaultOn/>
                <ToggleRow label="Product updates from Janaki Raghav" hint="Roadmap & feature announcements" />
              </div>
              <SaveRow />
            </>
          )}
          {tab === "appearance" && (
            <>
              <SectionHead title="Appearance" subtitle="Brand kit and theming for the dashboard." />
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Brand colours</label>
                <div className="flex gap-3">
                  <ColorSwatch hex="#FFBD59" name="Gold"/>
                  <ColorSwatch hex="#303642" name="Dark"/>
                  <ColorSwatch hex="#FFFFFF" name="Background"/>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ASelect label="Theme" opts={["Light", "Dark", "System"]} value="Light"/>
                <ASelect label="Density" opts={["Comfortable", "Compact"]} value="Comfortable"/>
              </div>
              <SaveRow />
            </>
          )}
          {tab === "billing" && (
            <>
              <SectionHead title="Billing" subtitle="No billing records are connected yet." />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Billing details will appear here when a real billing integration is connected.</div>
            </>
          )}
          {tab === "security" && (
            <>
              <SectionHead title="Security" subtitle="Keep your account protected." />
              <div className="grid sm:grid-cols-2 gap-4">
                <AField label="Current password" placeholder="••••••••" />
                <AField label="New password" placeholder="At least 12 characters" />
              </div>
              <ToggleRow label="Two-factor authentication" hint="Require OTP from authenticator app on every login" defaultOn/>
              <ToggleRow label="Session timeout" hint="Auto sign-out after 30 minutes of inactivity"/>
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 flex items-center gap-3">
                <Shield size={18} className="text-rose-600"/>
                <div className="flex-1 text-xs text-rose-700">Deleting your admin account removes all linked data. This cannot be undone.</div>
                <button className="text-xs font-semibold text-white bg-rose-600 rounded-lg px-3 py-1.5">Delete account</button>
              </div>
              <SaveRow />
            </>
          )}
        </section>
      </div>
    </>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="pb-4 border-b border-slate-100">
      <h3 className="font-bold text-lg flex items-center gap-2"><Globe size={14} className="text-brand-gold"/>{title}</h3>
      <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
    </div>
  );
}

function SaveRow() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
      <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Cancel</button>
      <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}
        className={`rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 ${
          saved ? "bg-emerald-100 text-emerald-700" : "bg-brand-dark text-white hover:bg-brand-dark/90"
        }`}>
        {saved ? <><Check size={14}/> Saved</> : <><Save size={14}/> Save changes</>}
      </button>
    </div>
  );
}

function ToggleRow({ label, hint, defaultOn = false }: { label: string; hint: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-slate-500">{hint}</div>
      </div>
      <button onClick={() => setOn(!on)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-brand-gold" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-0.5"}`}/>
      </button>
    </div>
  );
}

function ColorSwatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="text-center">
      <div className="h-14 w-14 rounded-xl border border-slate-200 shadow-sm" style={{ background: hex }}/>
      <div className="text-[11px] font-semibold mt-1.5">{name}</div>
      <div className="text-[10px] text-slate-500">{hex}</div>
    </div>
  );
}
