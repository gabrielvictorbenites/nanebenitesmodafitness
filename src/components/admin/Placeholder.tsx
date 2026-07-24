export function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-8 py-10">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-900">{title}</h1>
      </header>
      <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </div>
  );
}