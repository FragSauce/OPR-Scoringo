import { SECONDARY_MISSIONS, getSecondaryMission } from "../data/missions";
import type { ArmyFlags } from "./matchTypes";

/** A random source returning a float in [0, 1). Inject for deterministic tests. */
export type Rng = () => number;

/** Deterministic, seedable PRNG (mulberry32). */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns a new array shuffled with Fisher–Yates. Does not mutate the input. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** A freshly shuffled deck containing all 12 secondary card ids. */
export function buildDeck(rng: Rng): string[] {
  return shuffle(
    SECONDARY_MISSIONS.map((m) => m.id),
    rng,
  );
}

/**
 * Whether a card can be kept given the opponent's army. Conditional cards
 * ("discard this and draw a new card if the opponent has no …") are unplayable
 * when the opponent's army lacks the required feature.
 */
export function isPlayable(cardId: string, opponentFlags: ArmyFlags): boolean {
  const card = getSecondaryMission(cardId);
  if (card.requiresOpponentHero && !opponentFlags.hasHero) return false;
  if (card.requiresOpponentTough6 && !opponentFlags.hasTough6) return false;
  if (card.requiresOpponent15Models && !opponentFlags.has15Models) return false;
  return true;
}

export interface DrawState {
  deck: string[];
  hand: string[];
  discard: string[];
}

export interface DrawResult extends DrawState {
  /** Conditional cards that were auto-skipped during this draw. */
  skipped: string[];
}

/**
 * Draw from the top of the deck until the hand holds `target` cards, auto-skipping
 * conditional cards the opponent doesn't qualify for (those go to the discard pile).
 * If the deck empties, the discard pile is reshuffled back into it. Pure — returns
 * new arrays and never mutates the inputs.
 */
export function drawUntil(
  state: DrawState,
  target: number,
  opponentFlags: ArmyFlags,
  rng: Rng,
): DrawResult {
  let deck = state.deck.slice();
  const hand = state.hand.slice();
  let discard = state.discard.slice();
  const skipped: string[] = [];

  // Guard against impossible targets / infinite loops: there are only so many cards.
  let safety = SECONDARY_MISSIONS.length * 4;

  while (hand.length < target && safety-- > 0) {
    if (deck.length === 0) {
      if (discard.length === 0) break; // nothing left anywhere
      deck = shuffle(discard, rng);
      discard = [];
    }
    const cardId = deck.shift()!;
    if (hand.includes(cardId)) {
      // Already in hand (can happen after a reshuffle) — set aside and continue.
      discard.push(cardId);
      continue;
    }
    if (isPlayable(cardId, opponentFlags)) {
      hand.push(cardId);
    } else {
      discard.push(cardId);
      skipped.push(cardId);
    }
  }

  return { deck, hand, discard, skipped };
}
