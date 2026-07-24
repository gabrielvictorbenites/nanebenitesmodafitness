import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Users, Image as ImageIcon, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, leads: 0, banners: 0, featured: 0 });

  useEffect(() => {
    (async () => {
      const [p, l, b, f] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("banners").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("featured", true),
      ]);
      setStats({
        products: p.count ?? 0,
        leads: l.count ?? 0,
        banners: b.count ?? 0,
        featured: f.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Produtos cadastrados", value: stats.products, icon: Package },
    { label: "Produtos em destaque", value: stats.featured, icon: TrendingUp },
    { label: "Banners ativos", value: stats.banners, icon: ImageIcon },
    { label: "Leads recebidos", value: stats.leads, icon: Users },
  ];

  return (
    <div className="px-8 py-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Visão geral da sua loja.</p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{c.label}</p>
                <Icon className="h-4 w-4 text-[oklch(0.55_0.22_300)]" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-neutral-900">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
        <p className="text-sm text-neutral-500">
          Métricas avançadas (visitas, conversões, top produtos) chegarão na Fase 4.
        </p>
      </div>
    </div>
  );
}