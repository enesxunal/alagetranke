import { createClient } from "./server";
import { isSupabaseConfigured } from "./env";

export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    return { ok: true as const, demo: true as const };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return { ok: false as const, error: "Forbidden" };
  }

  return { ok: true as const, demo: false as const };
}
