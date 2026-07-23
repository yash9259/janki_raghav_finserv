import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin", replace: true });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, fullName);
      if (res.error) {
        toast.error(res.error);
      } else if (mode === "signup") {
        toast.success("Account created. Signing you in…");
        const s = await signIn(email, password);
        if (s.error) toast.error(s.error);
      } else {
        toast.success("Welcome back");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-gold/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl gradient-gold grid place-items-center">
            <span className="font-black text-brand-dark text-lg">A</span>
          </div>
          <div className="text-white font-bold text-xl">Janaki Raghav<span className="text-brand-gold">.</span></div>
        </Link>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white">
            {mode === "signin" ? "Admin sign in" : "Create admin account"}
          </h1>
          <p className="text-sm text-white/60 mt-1">
            {mode === "signin" ? "Access your dashboard." : "First signup automatically becomes the super admin."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <LabeledInput icon={UserIcon} label="Full name" value={fullName} onChange={setFullName} required />
            )}
            <LabeledInput icon={Mail} type="email" label="Email" value={email} onChange={setEmail} required />
            <LabeledInput icon={Lock} type="password" label="Password" value={password} onChange={setPassword} required minLength={6} />

            <button
              disabled={busy}
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-gold text-brand-dark font-bold py-3 hover:shadow-gold transition disabled:opacity-60"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-white/60">
            {mode === "signin" ? "Need an account?" : "Already registered?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-brand-gold font-semibold hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-white/50 hover:text-white">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({
  icon: Icon, label, value, onChange, type = "text", required, minLength,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; minLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 focus-within:border-brand-gold">
        <Icon size={15} className="text-white/40" />
        <input
          type={type}
          value={value}
          required={required}
          minLength={minLength}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
        />
      </div>
    </div>
  );
}