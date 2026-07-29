import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Check, RotateCcw, ExternalLink } from "lucide-react";
import {
  TEXT_GROUPS,
  buildDefaults,
  fetchSiteTexts,
  saveSiteTexts,
  type SiteTextsMap,
} from "@/lib/site-content";

export const Route = createFileRoute("/admin/conteudo")({
  ssr: false,
  component: ContentPage,
});

function ContentPage() {
  const defaults = useMemo(() => buildDefaults(), []);
  const [values, setValues] = useState<SiteTextsMap>(defaults);
  const [initial, setInitial] = useState<SiteTextsMap>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const map = await fetchSiteTexts();
      setValues(map);
      setInitial(map);
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao carregar");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const dirty = useMemo(
    () => Object.keys(values).some((k) => values[k] !== initial[k]),
    [values, initial],
  );

  async function onSave() {
    setSaving(true);
    setErr(null);
    setSaved(false);
    try {
      await saveSiteTexts(values);
      setInitial(values);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  function resetSlot(key: string) {
    setValues((v) => ({ ...v, [key]: defaults[key] }));
  }

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Conteúdo institucional</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Edite os textos que aparecem na Home e na página Sobre. As alterações refletem no site após salvar.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
          {saving ? "Salvando" : saved ? "Salvo!" : "Salvar alterações"}
        </button>
      </header>

      {err ? <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{err}</p> : null}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </div>
      ) : (
        <div className="space-y-6">
          {TEXT_GROUPS.map((group) => (
            <section key={group.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-serif text-xl font-bold text-neutral-900">{group.title}</h2>
                  <p className="text-xs text-neutral-500">Página: {group.page}</p>
                </div>
                <a
                  href={group.page}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Ver no site <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="grid gap-4">
                {group.slots.map((slot) => {
                  const changed = values[slot.key] !== defaults[slot.key];
                  return (
                    <div key={slot.key}>
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                          {slot.label}
                        </label>
                        {changed ? (
                          <button
                            type="button"
                            onClick={() => resetSlot(slot.key)}
                            className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800"
                          >
                            <RotateCcw className="h-3 w-3" /> Restaurar padrão
                          </button>
                        ) : null}
                      </div>
                      {slot.multiline ? (
                        <textarea
                          rows={3}
                          value={values[slot.key] ?? ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [slot.key]: e.target.value }))
                          }
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={values[slot.key] ?? ""}
                          onChange={(e) =>
                            setValues((v) => ({ ...v, [slot.key]: e.target.value }))
                          }
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}