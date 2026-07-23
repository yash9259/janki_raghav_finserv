import { createServerFn } from "@tanstack/react-start";

export type TrackedLead = {
  id: string;
  name: string;
  phone: string;
  pan: string | null;
  product: string | null;
  amount: string | null;
  loan_amount: number | null;
  interest_rate: number | null;
  tenure_years: number | null;
  stage: string;
  query_note: string | null;
  rejection_reason: string | null;
  created_at: string;
};

export const trackByPan = createServerFn({ method: "POST" })
  .inputValidator((input: { pan: string }) => {
    const pan = (input.pan || "").trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      throw new Error("Enter a valid 10-character PAN (e.g. ABCDE1234F)");
    }
    return { pan };
  })
  .handler(async ({ data }): Promise<TrackedLead[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("leads")
      .select("id,name,phone,pan,product,amount,loan_amount,interest_rate,tenure_years,stage,query_note,rejection_reason,created_at")
      .ilike("pan", data.pan)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (rows ?? []) as TrackedLead[];
  });