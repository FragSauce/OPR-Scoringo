import { SCHEMA_VERSION } from "./matchReducer";
import type { Match } from "./matchTypes";

const STORAGE_KEY = "opr-scoringo-match";

export function loadMatch(): Match | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Match;
    // Drop incompatible saves rather than crash on an old schema.
    if (!parsed || parsed.version !== SCHEMA_VERSION) return null;
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
