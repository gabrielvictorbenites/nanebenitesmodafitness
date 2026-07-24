import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/leads")({
  ssr: false,
  component: () => <Placeholder title="Leads" description="Contatos recebidos pelo formulário. Exportação CSV disponível na Fase 4." />,
});