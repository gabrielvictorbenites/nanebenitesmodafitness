import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  checking: boolean;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

export function useAdminAuth(): AdminAuthState & { signOut: () => Promise<void> } {
  const [state, setState] = useState<AdminAuthState>({
    checking: true,
    userId: null,
    email: null,
    isAdmin: false,
  });

  useEffect(() => {
    let alive = true;

    async function refresh(userId: string | null, email: string | null) {
      if (!userId) {
        if (alive) setState({ checking: false, userId: null, email: null, isAdmin: false });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (alive) setState({ checking: false, userId, email, isAdmin: !!data });
    }

    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      refresh(s?.user.id ?? null, s?.user.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      refresh(s?.user.id ?? null, s?.user.email ?? null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { ...state, signOut: async () => { await supabase.auth.signOut(); } };
}