import { useState } from "react";
import { PRIMARY_MISSIONS } from "../data/missions";
import type { NewMatchConfig } from "../state/matchReducer";
import type { ArmyFlags, PrimaryMissionId } from "../state/matchTypes";
import { useMatch } from "../state/useMatch";
import { Button, Card, Toggle } from "./ui";

const DEFAULT_ARMY: ArmyFlags = { hasHero: true, hasTough6: true, has15Models: true };

export function SetupScreen() {
  const { dispatch } = useMatch();
  const [primaryId, setPrimaryId] = useState<PrimaryMissionId>("take-and-hold");
  const [opponentArmy, setOpponentArmy] = useState<ArmyFlags>(DEFAULT_ARMY);

  const start = () => {
    const config: NewMatchConfig = {
      primaryMissionId: primaryId,
      secondaryVpValue: 1,
      totalRounds: 4,
      opponentFlags: opponentArmy,
    };
    dispatch({ type: "NEW_MATCH", config });
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 p-4 pb-24">
      <header className="pt-2 text-center">
        <h1 className="text-3xl font-black tracking-tight text-emerald-400">OPR Scoringo</h1>
        <p className="text-sm text-slate-400">Your personal score tracker</p>
      </header>

      <Card>
        <h2 className="mb-3 text-lg font-bold">Primary mission</h2>
        <div className="flex flex-col gap-2">
          {PRIMARY_MISSIONS.map((m) => {
            const selected = m.id === primaryId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setPrimaryId(m.id)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? "border-emerald-500 bg-emerald-950/40"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{m.name}</span>
                  {selected && <span className="text-emerald-400">✓</span>}
                </div>
                <p className="text-sm text-slate-400">{m.summary}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 text-lg font-bold">Opponent's army</h2>
        <p className="mb-3 text-xs text-slate-400">
          Used to auto-skip secondaries that can't be scored against your opponent (Assassination,
          Bring it Down, Cull the Horde).
        </p>
        <div className="flex flex-col gap-2.5 pl-1">
          <Toggle
            checked={opponentArmy.hasHero}
            onChange={(v) => setOpponentArmy({ ...opponentArmy, hasHero: v })}
            label="Opponent has a Hero"
          />
          <Toggle
            checked={opponentArmy.hasTough6}
            onChange={(v) => setOpponentArmy({ ...opponentArmy, hasTough6: v })}
            label="Opponent has a Tough 6+ unit"
          />
          <Toggle
            checked={opponentArmy.has15Models}
            onChange={(v) => setOpponentArmy({ ...opponentArmy, has15Models: v })}
            label="Opponent has 15+ models"
          />
        </div>
      </Card>

      <Button variant="primary" className="py-3.5 text-lg" onClick={start}>
        Start match
      </Button>
    </div>
  );
}
