import { PRIMARY_MISSIONS } from "../data/missions";
import { SCHEMA_VERSION } from "./matchReducer";
import type { Match } from "./matchTypes";

const STORAGE_KEY = "opr-scoringo-match";
const KNOWN_PRIMARY_IDS = new Set(PRIMARY_MISSIONS.map((m) => m.id));

export function loadMatch(): Match | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Match;
    // Drop incompatible saves rather than crash on an old schema or a removed mission.
    if (!parsed || parsed.version !== SCHEMA_VERSION) return null;
    if (!KNOWN_PRIMARY_IDS.has(parsed.primaryMissionId)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveMatch(match: Match | null): void {
  try {
    if (match === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    }
  } catch {
    // Ignore quota / privacy-mode errors — the app still works in-memory.
  }
}
