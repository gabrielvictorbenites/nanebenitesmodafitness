import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Package, Users, Image as ImageIcon, TrendingUp, AlertTriangle,
  Tag, Sparkles, ShoppingBag, MessageCircle, ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
});

type LeadRow = { id: string; name: string; source: string; status: string; created_at: string; phone: string };
type ProductRow = { id: string; name: string; sku: string; category: string; brand: string; stock: number; active: boolean; featured: boolean; on_sale: boolean; price: number; sale_price: number | null; image: string; slug: string; created_at: string };

const BRAND_COLORS = ["#1FB6B6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#6366F1", "#EF4444"];

function daysAgoISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function fmtDay(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [bannersActive, setBannersActive] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);

  useEffect(() => {
    (async () => {
      const since = daysAgoISO(60);
      const [p, l, b, m] = await Promise.all([
        supabase.from("products").select("id,name,sku,category,brand,stock,active,featured,on_sale,price,sale_price,image,slug,created_at").order("created_at", { ascending: false }),
        supabase.from("leads").select("id,name,source,status,created_at,phone").gte("created_at", since).order("created_at", { ascending: false }),
        supabase.from("banners").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("product_media").select("id", { count: "exact", head: true }),
      ]);
      setProducts((p.data ?? []) as ProductRow[]);
      setLeads((l.data ?? []) as LeadRow[]);
      setBannersActive(b.count ?? 0);
      setMediaCount(m.count ?? 0);
      setLoading(false);
    })();
  }, []);

  const kpis = useMemo(() => {
    const active = products.filter((p) => p.active).length;
    const featured = products.filter((p) => p.featured).length;
    const onSale = products.filter((p) => p.on_sale).length;
    const lowStock = products.filter((p) => p.active && p.stock <= 3).length;
    const outOfStock = products.filter((p) => p.active && p.stock === 0).length;
    const last7 = new Date(); last7.setDate(last7.getDate() - 7);
    const last30 = new Date(); last30.setDate(last30.getDate() - 30);
    const leads7 = leads.filter((l) => new Date(l.created_at) >= last7).length;
    const leads30 = leads.filter((l) => new Date(l.created_at) >= last30).length;
    const openLeads = leads.filter((l) => l.status === "new").length;
    const converted = leads.filter((l) => l.status === "converted").length;
    const convRate = leads30 > 0 ? Math.round((converted / leads30) * 100) : 0;
    return { active, featured, onSale, lowStock, outOfStock, leads7, leads30, openLeads, converted, convRate };
  }, [products, leads]);

  const leadsByDay = useMemo(() => {
    const days: { date: string; label: string; leads: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      days.push({ date: d.toISOString(), label: fmtDay(d.toISOString()), leads: 0 });
    }
    leads.forEach((l) => {
      const day = new Date(l.created_at); day.setHours(0, 0, 0, 0);
      const entry = days.find((d) => d.date === day.toISOString());
      if (entry) entry.leads += 1;
    });
    return days;
  }, [leads]);

  const leadsBySource = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => map.set(l.source || "contato", (map.get(l.source || "contato") ?? 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const leadsByStatus = useMemo(() => {
    const labels: Record<string, string> = { new: "Novos", contacted: "Contatados", converted: "Convertidos", lost: "Perdidos" };
    const map = new Map<string, number>();
    leads.forEach((l) => map.set(l.status, (map.get(l.status) ?? 0) + 1));
    return Array.from(map.entries()).map(([k, v]) => ({ name: labels[k] ?? k, value: v }));
  }, [leads]);

  const topCategories = useMemo(() => {
    const map = new Map<string, number>();
    products.filter((p) => p.active).forEach((p) => {
      const key = p.category || "sem categoria";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [products]);

  const topBrands = useMemo(() => {
    const map = new Map<string, number>();
    products.filter((p) => p.active && p.brand).forEach((p) => {
      map.set(p.brand, (map.get(p.brand) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [products]);

  const lowStockList = useMemo(
    () => products.filter((p) => p.active && p.stock <= 3).sort((a, b) => a.stock - b.stock).slice(0, 6),
    [products],
  );

  const recentLeads = leads.slice(0, 6);

  const kpiCards = [
    { label: "Produtos ativos", value: kpis.active, icon: Package, tone: "text-[#1FB6B6]" },
    { label: "Em destaque", value: kpis.featured, icon: Sparkles, tone: "text-[#8B5CF6]" },
    { label: "Em promoção", value: kpis.onSale, icon: Tag, tone: "text-[#EC4899]" },
    { label: "Banners ativos", value: bannersActive, icon: ImageIcon, tone: "text-[#F59E0B]" },
    { label: "Leads (7d)", value: kpis.leads7, icon: TrendingUp, tone: "text-[#10B981]" },
    { label: "Leads (30d)", value: kpis.leads30, icon: Users, tone: "text-[#6366F1]" },
    { label: "Aguardando contato", value: kpis.openLeads, icon: MessageCircle, tone: "text-[#EF4444]" },
    { label: "Taxa conversão", value: `${kpis.convRate}%`, icon: ShoppingBag, tone: "text-[#1FB6B6]" },
  ];

  return (
    <div className="px-8 py-10">
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">Métricas em tempo real da sua loja - dados conectados ao site.</p>
        </div>
        <div className="hidden gap-2 md:flex">
          <Link to="/admin/produtos" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400">Gerenciar produtos</Link>
          <Link to="/admin/leads" className="rounded-full bg-gradient-to-r from-[#1FB6B6] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-sm">Ver leads</Link>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpiCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{c.label}</p>
                <Icon className={`h-4 w-4 ${c.tone}`} />
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-neutral-900">{loading ? "-" : c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-neutral-900">Leads nos últimos 30 dias</h2>
              <p className="text-xs text-neutral-500">Total no período: {kpis.leads30}</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsByDay} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1FB6B6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Area type="monotone" dataKey="leads" stroke="#8B5CF6" strokeWidth={2} fill="url(#leadGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-neutral-900">Status dos leads</h2>
          <p className="text-xs text-neutral-500">Distribuição atual</p>
          <div className="mt-2 h-64">
            {leadsByStatus.length === 0 ? (
              <EmptyMsg text="Nenhum lead ainda." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadsByStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {leadsByStatus.map((_, i) => <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {leadsByStatus.map((s, i) => (
              <span key={s.name} className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-2 py-1 text-[11px] text-neutral-700">
                <span className="h-2 w-2 rounded-full" style={{ background: BRAND_COLORS[i % BRAND_COLORS.length] }} />
                {s.name} · {s.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-neutral-900">Top categorias</h2>
          <p className="text-xs text-neutral-500">Produtos ativos por categoria</p>
          <div className="mt-4 h-56">
            {topCategories.length === 0 ? <EmptyMsg text="Sem produtos ativos." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCategories} layout="vertical" margin={{ left: 8, right: 12 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                  <Bar dataKey="total" radius={[0, 8, 8, 0]} fill="#1FB6B6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-neutral-900">Top marcas</h2>
          <p className="text-xs text-neutral-500">Produtos ativos por marca</p>
          <div className="mt-4 h-56">
            {topBrands.length === 0 ? <EmptyMsg text="Nenhuma marca cadastrada." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBrands} layout="vertical" margin={{ left: 8, right: 12 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                  <Bar dataKey="total" radius={[0, 8, 8, 0]} fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-neutral-900">Origem dos leads</h2>
          <p className="text-xs text-neutral-500">De onde vêm os contatos</p>
          <div className="mt-4 h-56">
            {leadsBySource.length === 0 ? <EmptyMsg text="Nenhum lead ainda." /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadsBySource} dataKey="value" nameKey="name" outerRadius={80}>
                    {leadsBySource.map((_, i) => <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
              <h2 className="font-display text-lg font-semibold text-neutral-900">Estoque baixo</h2>
            </div>
            <Link to="/admin/produtos" className="text-xs font-medium text-neutral-500 hover:text-neutral-900">Ver todos →</Link>
          </div>
          <p className="text-xs text-neutral-500">Produtos com 3 ou menos unidades ({kpis.lowStock} total, {kpis.outOfStock} zerados)</p>
          <ul className="mt-4 divide-y divide-neutral-100">
            {lowStockList.length === 0 && <li className="py-6 text-center text-xs text-neutral-400">Todos os produtos com estoque saudável.</li>}
            {lowStockList.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">{p.name}</p>
                  <p className="text-xs text-neutral-500">{p.sku || "sem SKU"} · {p.category || "sem categoria"}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${p.stock === 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                  {p.stock} un.
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-neutral-900">Últimos leads</h2>
            <Link to="/admin/leads" className="text-xs font-medium text-neutral-500 hover:text-neutral-900">Ver todos →</Link>
          </div>
          <p className="text-xs text-neutral-500">Contatos recentes recebidos pelo site</p>
          <ul className="mt-4 divide-y divide-neutral-100">
            {recentLeads.length === 0 && <li className="py-6 text-center text-xs text-neutral-400">Nenhum lead recebido ainda.</li>}
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1FB6B6] to-[#8B5CF6] text-xs font-semibold text-white">
                  {l.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">{l.name}</p>
                  <p className="text-xs text-neutral-500">{l.source} · {new Date(l.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-700">{l.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <SnapshotCard label="Total no catálogo" value={products.length} sub={`${mediaCount} imagens`} icon={Package} />
        <SnapshotCard label="Estoque total" value={products.reduce((s, p) => s + (p.stock || 0), 0)} sub="unidades" icon={ShoppingBag} />
        <SnapshotCard label="Ticket médio" value={products.length ? `R$ ${(products.reduce((s, p) => s + Number(p.sale_price ?? p.price ?? 0), 0) / products.length).toFixed(0)}` : "R$ 0"} sub="preço médio de venda" icon={Tag} />
        <SnapshotCard label="Leads convertidos" value={kpis.converted} sub="marcados como convertidos" icon={ArrowUpRight} />
      </div>
    </div>
  );
}

function EmptyMsg({ text }: { text: string }) {
  return <div className="flex h-full items-center justify-center text-xs text-neutral-400">{text}</div>;
}

function SnapshotCard({ label, value, sub, icon: Icon }: { label: string; value: number | string; sub: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{label}</p>
        <Icon className="h-4 w-4 text-neutral-400" />
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-neutral-900">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{sub}</p>
    </div>
  );
}