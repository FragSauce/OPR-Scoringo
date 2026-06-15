import { getPrimaryMission } from "../data/missions";
import { isScoringRound, previewRound } from "../logic/scoring";
import type { Match } from "../state/matchTypes";
import { useMatch } from "../state/useMatch";
import { SecondaryCardView } from "./SecondaryCard";
import { Button, Card, NumberStepper, Toggle } from "./ui";

export function RoundScoringPanel({ match }: { match: Match }) {
  const { dispatch } = useMatch();
  const round = match.currentRound;
  const scoring = isScoringRound(round);
  const primary = getPrimaryMission(match.primaryMissionId);

  if (!scoring) {
    // Round 1: deployment, nothing scores.
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <h3 className="text-lg font-bold text-emerald-400">Round 1 — Deployment</h3>
          <p className="mt-1 text-sm text-slate-300">
            No victory points are scored in round 1, and secondaries aren't drawn until round 2.
            When you're ready, begin round 2.
          </p>
        </Card>
        <Button
          variant="primary"
          className="py-3.5 text-lg"
          onClick={() => dispatch({ type: "COMMIT_ROUND" })}
        >
          Begin Round 2 →
        </Button>
      </div>
    );
  }

  const preview = previewRound(match, round);
  const isLast = round >= match.totalRounds;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-slate-800/60 p-3 text-sm text-slate-300">
        <span className="font-bold text-emerald-400">Round {round} — Scoring.</span> Primary:{" "}
        <span className="font-semibold">{primary.name}</span>.
      </div>

      <Card>
        <h3 className="mb-3 text-sm uppercase tracking-wide text-slate-400">Primary</h3>
        <NumberStepper
          label={`${primary.name} VP this round`}
          value={match.draft.primaryVp}
          min={0}
          onChange={(n) => dispatch({ type: "SET_ROUND_INPUTS", inputs: { primaryVp: n } })}
        />
        <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
            {primary.name} — how to score
          </p>
          <p className="whitespace-pre-line text-sm text-slate-300">{primary.rules}</p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-2 text-sm uppercase tracking-wide text-slate-400">
          Secondaries — tick if scored
        </h3>
        <div className="flex flex-col gap-2">
          {match.hand.map((cardId) => {
            const scored = match.draft.scoredSecondaryIds.includes(cardId);
            return (
              <SecondaryCardView
                key={cardId}
                cardId={cardId}
                highlight={scored}
                footer={
                  <Toggle
                    checked={scored}
                    onChange={() => dispatch({ type: "TOGGLE_SECONDARY_SCORED", cardId })}
                    label={scored ? "Scored ✓" : "Not scored"}
                  />
                }
              />
            );
          })}
        </div>
      </Card>

      <Card className="text-center">
        <h3 className="mb-1 text-sm uppercase tracking-wide text-slate-400">This round earns</h3>
        <p className="text-4xl font-black tabular-nums">{preview.totalVp}</p>
        <p className="text-xs text-slate-400">
          {preview.primaryVp} primary · {preview.secondaryVp} secondary
        </p>
      </Card>

      <Button
        variant="primary"
        className="py-3.5 text-lg"
        onClick={() => dispatch({ type: "COMMIT_ROUND" })}
      >
        {isLast ? "Finish game 🏆" : `Commit round ${round} →`}
      </Button>
    </div>
  );
}
