import { useState } from "react";
import { PRIMARY_MISSIONS, SECONDARY_MISSIONS } from "../data/missions";
import { Button } from "./ui";

export function RulesReference() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" className="text-sm" onClick={() => setOpen(true)}>
        📖 Rules
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-700 p-4">
            <h2 className="text-xl font-bold">Mission reference</h2>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <section className="mb-6">
              <h3 className="mb-2 text-lg font-bold text-emerald-400">Objective control</h3>
              <p className="text-sm text-slate-300">
                Control of an objective goes to whoever has the most OC within 3" of it. A unit's OC
                equals its Tough value, or 2 if it has no Tough. Once you control an objective you
                keep it until the enemy takes it.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="mb-2 text-lg font-bold text-emerald-400">Primary missions</h3>
              <div className="flex flex-col gap-3">
                {PRIMARY_MISSIONS.map((m) => (
                  <div key={m.id} className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                    <p className="font-bold">{m.name}</p>
                    <p className="whitespace-pre-line text-sm text-slate-300">{m.rules}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="pb-8">
              <h3 className="mb-2 text-lg font-bold text-emerald-400">Secondary missions</h3>
              <div className="flex flex-col gap-3">
                {SECONDARY_MISSIONS.map((m) => (
                  <div key={m.id} className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                    <p className="font-bold">
                      {m.number}. {m.name}
                    </p>
                    <p className="whitespace-pre-line text-sm text-slate-300">{m.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
