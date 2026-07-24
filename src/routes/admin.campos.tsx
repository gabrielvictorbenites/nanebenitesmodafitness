import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/campos")({
  ssr: false,
  component: () => <Placeholder title="Campos personalizados" description="Configuração de atributos extras dos produtos. Disponível na Fase 2." />,
});