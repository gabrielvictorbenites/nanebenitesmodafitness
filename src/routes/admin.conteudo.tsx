import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/conteudo")({
  ssr: false,
  component: () => <Placeholder title="Conteúdo institucional" description="Textos da Home, Sobre e Contato. Disponível na Fase 3." />,
});