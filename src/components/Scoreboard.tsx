import { useState } from "react";
import { getPrimaryMission } from "../data/missions";
import type { Match } from "../state/matchTypes";
import { useMatch } from "../state/useMatch";
import { RoundScoringPanel } from "./RoundScoringPanel";
import { RulesReference } from "./RulesReference";
import { SecondaryDrawPanel } from "./SecondaryDrawPanel";
import { Button, Card } from "./ui";

function TotalCard({ match }: { match: Match }) {
  return (
    <div className="rounded-xl border border-emerald-600/50 bg-emerald-600/10 p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-slate-400">Your victory points</p>
      <p className="text-6xl font-black tabular-nums leading-tight">{match.totalVp}</p>
      <p className="text-sm text-slate-400">
        {match.primaryVp} primary · {match.secondaryVp} secondary
      </p>
    </div>
  );
}

function History({ match }: { match: Match }) {
  const [open, setOpen] = useState(false);
  if (match.history.length === 0) return null;

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-center justify-between font-bold"
        onClick={() => setOpen((v) => !v)}
      >
        <span>Round-by-round breakdown</span>
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="py-1 pr-2">Round</th>
              <th className="py-1 pr-2">Primary</th>
              <th className="py-1 pr-2">Secondary</th>
              <th className="py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {match.history.map((r) => (
              <tr key={r.round} className="border-t border-slate-700 tabular-nums">
                <td className="py-1.5 pr-2 font-semibold">{r.round}</td>
                <td className="py-1.5 pr-2">{r.primaryVp}</td>
                <td className="py-1.5 pr-2">{r.secondaryVp}</td>
                <td className="py-1.5 font-bold">{r.primaryVp + r.secondaryVp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

function GameOver({ match }: { match: Match }) {
  const { dispatch } = useMatch();
  return (
    <div className="flex flex-col gap-4">
      <Card className="text-center">
        <h2 className="text-2xl font-black text-emerald-400">Game over</h2>
        <p className="mt-1 text-sm text-slate-300">
          Compare your total with your opponent's to see who won.
        </p>
      </Card>
      <History match={match} />
      <Button variant="danger" onClick={() => dispatch({ type: "RESET" })}>
        New match
      </Button>
    </div>
  );
}

export function Scoreboard({ match }: { match: Match }) {
  const { dispatch } = useMatch();
  const primary = getPrimaryMission(match.primaryMissionId);

  const phaseLabel =
    match.phase === "gameOver"
      ? "Complete"
      : match.phase === "draw"
        ? "Draw secondaries"
        : match.currentRound === 1
          ? "Deployment"
          : "Scoring";

  const newMatch = () => {
    if (confirm("Abandon the current match and start over?")) {
      dispatch({ type: "RESET" });
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4 pb-24">
      <header className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black tracking-tight text-emerald-400">OPR Scoringo</h1>
          <p className="text-xs text-slate-400">
            {primary.name} ·{" "}
            {match.phase === "gameOver"
              ? "Complete"
              : `Round ${match.currentRound}/${match.totalRounds} · ${phaseLabel}`}
          </p>
        </div>
        <div className="flex gap-2">
          <RulesReference />
          <Button variant="ghost" className="text-sm" onClick={newMatch}>
            New
          </Button>
        </div>
      </header>

      <TotalCard match={match} />

      {match.phase !== "gameOver" && <History match={match} />}

      {match.phase === "gameOver" ? (
        <GameOver match={match} />
      ) : match.phase === "draw" ? (
        <SecondaryDrawPanel match={match} />
      ) : (
        <RoundScoringPanel match={match} />
      )}
    </div>
  );
}
