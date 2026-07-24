import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/admin/Placeholder";

export const Route = createFileRoute("/admin/banners")({
  ssr: false,
  component: () => <Placeholder title="Banners" description="Editor de banners rotativos da home. Disponível na Fase 3." />,
});