import { DRAW_TARGET, HAND_KEEP } from "../state/matchReducer";
import type { Match } from "../state/matchTypes";
import { useMatch } from "../state/useMatch";
import { SecondaryCardView } from "./SecondaryCard";
import { Button, Card } from "./ui";

export function SecondaryDrawPanel({ match }: { match: Match }) {
  const { dispatch } = useMatch();
  const handFull = match.hand.length >= DRAW_TARGET;
  const overKeep = match.hand.length > HAND_KEEP;
  const ready = match.hand.length === HAND_KEEP;
  const empty = match.deck.length + match.discard.length === 0;

  let hint: string;
  if (match.hand.length < DRAW_TARGET) hint = `Draw until you hold ${DRAW_TARGET} cards.`;
  else if (overKeep) hint = `Discard down to ${HAND_KEEP} cards to keep.`;
  else hint = `Ready — ${HAND_KEEP} cards kept.`;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-slate-800/60 p-3 text-sm text-slate-300">
        <span className="font-bold text-emerald-400">Round {match.currentRound} — Draw phase.</span>{" "}
        Discard what you don't want, draw to {DRAW_TARGET}, then keep {HAND_KEEP}. Cards your
        opponent can't be scored against are skipped automatically.
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <p className={`text-sm font-semibold ${ready ? "text-emerald-400" : "text-amber-400"}`}>
            {hint}
          </p>
          <span className="text-xs text-slate-400">{match.deck.length} in deck</span>
        </div>

        {match.hand.length === 0 ? (
          <p className="mb-3 text-sm italic text-slate-500">No cards in hand.</p>
        ) : (
          <div className="mb-3 flex flex-col gap-2">
            {match.hand.map((cardId) => (
              <SecondaryCardView
                key={cardId}
                cardId={cardId}
                footer={
                  <Button
                    variant="danger"
                    className="px-3 py-1.5 text-sm"
                    onClick={() => dispatch({ type: "DISCARD_SECONDARY", cardId })}
                  >
                    Discard
                  </Button>
                }
              />
            ))}
          </div>
        )}

        <Button
          variant="primary"
          disabled={handFull || empty}
          onClick={() => dispatch({ type: "DRAW_SECONDARY" })}
        >
          Draw to {DRAW_TARGET}
        </Button>
      </Card>

      <Button
        variant="primary"
        className="py-3.5 text-lg"
        disabled={!ready}
        onClick={() => dispatch({ type: "FINISH_DRAW" })}
      >
        {ready ? "Begin scoring →" : `Keep ${HAND_KEEP} cards to continue`}
      </Button>
    </div>
  );
}
