import type { Match, RoundDraft } from "../state/matchTypes";

/** No scoring happens in round 1 in any OPR mission here. */
export function isScoringRound(round: number): boolean {
  return round >= 2;
}

/** Primary VP for the round — entered directly by the player; none in round 1. */
export function computePrimaryVp(match: Match, round: number): number {
  return isScoringRound(round) ? match.draft.primaryVp : 0;
}

/** Secondary VP for a round = number of scored cards × the match's per-card value. */
export function computeSecondaryVp(draft: RoundDraft, secondaryVpValue: number): number {
  return draft.scoredSecondaryIds.length * secondaryVpValue;
}

export interface RoundPreview {
  primaryVp: number;
  secondaryVp: number;
  totalVp: number;
}

/** Live preview of the VP the current draft round would earn if committed. */
export function previewRound(match: Match, round: number): RoundPreview {
  const primaryVp = computePrimaryVp(match, round);
  const secondaryVp = isScoringRound(round)
    ? computeSecondaryVp(match.draft, match.secondaryVpValue)
    : 0;
  return { primaryVp, secondaryVp, totalVp: primaryVp + secondaryVp };
}
