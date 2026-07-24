import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/usuarios")({
  ssr: false,
  component: () => <Placeholder title="Usuários" description="Gestão de administradores. Disponível na Fase 4." />,
});