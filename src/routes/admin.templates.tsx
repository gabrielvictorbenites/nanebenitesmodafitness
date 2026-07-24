import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/templates")({
  ssr: false,
  component: () => <Placeholder title="Templates WhatsApp" description="Mensagens automáticas de contato. Disponível na Fase 3." />,
});