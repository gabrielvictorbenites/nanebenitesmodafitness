import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Users,
  MessageCircle,
  FileText,
  Tag,
  UserCircle,
  LogOut,
  ImagePlus,
} from "lucide-react";
import lotus from "@/assets/lotus.png.asset.json";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/banners", label: "Banners", icon: ImageIcon },
  { to: "/admin/imagens", label: "Imagens do site", icon: ImagePlus },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/conteudo", label: "Conteúdo", icon: FileText },
  { to: "/admin/campos", label: "Campos", icon: Tag },
  { to: "/admin/templates", label: "Templates WhatsApp", icon: MessageCircle },
  { to: "/admin/usuarios", label: "Usuários", icon: UserCircle },
];

export function AdminSidebar({
  email,
  onSignOut,
  open = false,
  onClose,
}: {
  email: string | null;
  onSignOut: () => void;
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <>
      {open ? (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-hidden />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-5">
        <img src={lotus.url} alt="" className="h-10 w-10 object-contain" />
        <div className="min-w-0">
          <p className="font-display text-sm font-bold tracking-widest text-neutral-900">NANE BENITES</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-[image:linear-gradient(135deg,oklch(0.72_0.13_195),oklch(0.55_0.22_300))]">
            Painel Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active = isActive(item.to, item.exact);
          const Icon = item.icon;
          return (
          <Link
              key={item.to}
              to={item.to as any}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[image:linear-gradient(135deg,oklch(0.72_0.13_195/0.15),oklch(0.55_0.22_300/0.15))] text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-[oklch(0.55_0.22_300)]" : ""}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-200 p-4">
        <p className="truncate text-xs text-neutral-500">{email ?? "-"}</p>
        <button
          onClick={onSignOut}
          className="mt-3 flex w-full items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          <LogOut className="h-3.5 w-3.5" /> Sair
        </button>
      </div>
      </aside>
    </>
  );
}