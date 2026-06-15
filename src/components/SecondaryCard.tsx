import { getSecondaryMission } from "../data/missions";
import type { ReactNode } from "react";

/** Compact display of a secondary mission card with its full condition text. */
export function SecondaryCardView({
  cardId,
  highlight = false,
  footer,
}: {
  cardId: string;
  highlight?: boolean;
  footer?: ReactNode;
}) {
  const card = getSecondaryMission(cardId);
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight ? "border-emerald-500 bg-emerald-950/30" : "border-slate-700 bg-slate-900/60"
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold">
          {card.number}
        </span>
        <span className="font-bold">{card.name}</span>
      </div>
      <p className="whitespace-pre-line text-sm text-slate-300">{card.text}</p>
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}
