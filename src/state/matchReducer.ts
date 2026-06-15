import { computePrimaryVp, computeSecondaryVp } from "../logic/scoring";
import { buildDeck, drawUntil, makeRng, type Rng } from "./deck";
import type { ArmyFlags, Match, PrimaryMissionId, RoundDraft } from "./matchTypes";

export const SCHEMA_VERSION = 3;
export const DRAW_TARGET = 3; // draw up to 3, then trim to KEEP
export const HAND_KEEP = 2;

export interface NewMatchConfig {
  primaryMissionId: PrimaryMissionId;
  secondaryVpValue: number;
  totalRounds: number;
  /** The OPPONENT's army features (used to filter your draws). */
  opponentFlags: ArmyFlags;
  /** Optional seed for deterministic decks (tests). Falls back to Math.random. */
  seed?: number;
}

export type MatchAction =
  | { type: "NEW_MATCH"; config: NewMatchConfig }
  | { type: "DRAW_SECONDARY" }
  | { type: "DISCARD_SECONDARY"; cardId: string }
  | { type: "SET_ROUND_INPUTS"; inputs: Partial<Pick<RoundDraft, "primaryVp">> }
  | { type: "TOGGLE_SECONDARY_SCORED"; cardId: string }
  | { type: "FINISH_DRAW" }
  | { type: "COMMIT_ROUND" }
  | { type: "RESET" };

function emptyDraft(): RoundDraft {
  return {
    primaryVp: 0,
    scoredSecondaryIds: [],
  };
}

function rngFor(seed?: number): Rng {
  if (seed === undefined) return Math.random;
  return makeRng(seed);
}

export function createMatch(config: NewMatchConfig): Match {
  const rng = rngFor(config.seed);
  return {
    version: SCHEMA_VERSION,
    primaryMissionId: config.primaryMissionId,
    secondaryVpValue: config.secondaryVpValue,
    totalRounds: config.totalRounds,
    opponentFlags: config.opponentFlags,
    deck: buildDeck(rng),
    hand: [],
    discard: [],
    totalVp: 0,
    primaryVp: 0,
    secondaryVp: 0,
    currentRound: 1,
    phase: "score", // round 1 scores nothing; acts as a "begin game" step
    history: [],
    draft: emptyDraft(),
  };
}

export function matchReducer(match: Match | null, action: MatchAction): Match | null {
  if (action.type === "NEW_MATCH") return createMatch(action.config);
  if (action.type === "RESET") return null;
  if (!match) return match;

  switch (action.type) {
    case "DRAW_SECONDARY": {
      if (match.phase !== "draw") return match;
      const result = drawUntil(
        { deck: match.deck, hand: match.hand, discard: match.discard },
        DRAW_TARGET,
        match.opponentFlags,
        rngFor(),
      );
      return { ...match, deck: result.deck, hand: result.hand, discard: result.discard };
    }

    case "DISCARD_SECONDARY": {
      if (match.phase !== "draw") return match;
      if (!match.hand.includes(action.cardId)) return match;
      return {
        ...match,
        hand: match.hand.filter((id) => id !== action.cardId),
        discard: [...match.discard, action.cardId],
      };
    }

    case "FINISH_DRAW": {
      if (match.phase !== "draw") return match;
      if (match.hand.length !== HAND_KEEP) return match;
      return { ...match, phase: "score" };
    }

    case "SET_ROUND_INPUTS": {
      if (match.phase !== "score") return match;
      const { inputs } = action;
      const next: RoundDraft = { ...match.draft };
      if (inputs.primaryVp !== undefined) {
        next.primaryVp = Math.max(0, Math.floor(inputs.primaryVp));
      }
      return { ...match, draft: next };
    }

    case "TOGGLE_SECONDARY_SCORED": {
      if (match.phase !== "score") return match;
      const has = match.draft.scoredSecondaryIds.includes(action.cardId);
      return {
        ...match,
        draft: {
          ...match.draft,
          scoredSecondaryIds: has
            ? match.draft.scoredSecondaryIds.filter((id) => id !== action.cardId)
            : [...match.draft.scoredSecondaryIds, action.cardId],
        },
      };
    }

    case "COMMIT_ROUND": {
      if (match.phase !== "score") return match;
      const round = match.currentRound;
      const primaryVp = computePrimaryVp(match, round);
      const secondaryVp = computeSecondaryVp(match.draft, match.secondaryVpValue);

      const record = { round, ...match.draft, primaryVp, secondaryVp };

      // Scored secondaries are spent (moved to discard); unscored cards carry over.
      const scored = new Set(match.draft.scoredSecondaryIds);
      const isLast = round >= match.totalRounds;

      return {
        ...match,
        hand: match.hand.filter((id) => !scored.has(id)),
        discard: [...match.discard, ...match.hand.filter((id) => scored.has(id))],
        primaryVp: match.primaryVp + primaryVp,
        secondaryVp: match.secondaryVp + secondaryVp,
        totalVp: match.totalVp + primaryVp + secondaryVp,
        history: [...match.history, record],
        draft: emptyDraft(),
        currentRound: isLast ? round : round + 1,
        phase: isLast ? "gameOver" : "draw",
      };
    }

    default:
      return match;
  }
}
