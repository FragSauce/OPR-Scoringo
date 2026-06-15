import type { Match, PrimaryMissionId, RoundDraft } from "../state/matchTypes";
import { computePrimaryVp, computeSecondaryVp, isScoringRound, previewRound } from "./scoring";

function draft(partial: Partial<RoundDraft>): RoundDraft {
  return { primaryVp: 0, scoredSecondaryIds: [], ...partial };
}

function makeMatch(d: RoundDraft, secondaryVpValue = 1): Match {
  const primaryMissionId: PrimaryMissionId = "take-and-hold";
  return {
    version: 3,
    primaryMissionId,
    secondaryVpValue,
    totalRounds: 4,
    opponentFlags: { hasHero: true, hasTough6: true, has15Models: true },
    deck: [],
    hand: [],
    discard: [],
    totalVp: 0,
    primaryVp: 0,
    secondaryVp: 0,
    currentRound: 2,
    phase: "score",
    history: [],
    draft: d,
  };
}

describe("isScoringRound", () => {
  it("excludes round 1", () => {
    expect(isScoringRound(1)).toBe(false);
    expect(isScoringRound(2)).toBe(true);
    expect(isScoringRound(4)).toBe(true);
  });
});

describe("computePrimaryVp", () => {
  it("returns the entered primary VP for a scoring round", () => {
    expect(computePrimaryVp(makeMatch(draft({ primaryVp: 3 })), 2)).toBe(3);
    expect(computePrimaryVp(makeMatch(draft({ primaryVp: 9 })), 4)).toBe(9);
  });

  it("returns 0 in round 1 regardless of the entered value", () => {
    expect(computePrimaryVp(makeMatch(draft({ primaryVp: 3 })), 1)).toBe(0);
  });
});

describe("computeSecondaryVp", () => {
  it("multiplies scored cards by the per-card value", () => {
    expect(computeSecondaryVp(draft({ scoredSecondaryIds: ["2", "5"] }), 1)).toBe(2);
    expect(computeSecondaryVp(draft({ scoredSecondaryIds: ["2", "5"] }), 2)).toBe(4);
    expect(computeSecondaryVp(draft({ scoredSecondaryIds: [] }), 3)).toBe(0);
  });
});

describe("previewRound", () => {
  it("sums entered primary VP and secondary VP into a total", () => {
    const m = makeMatch(draft({ primaryVp: 3, scoredSecondaryIds: ["2"] }), 1);
    const preview = previewRound(m, 2);
    expect(preview.primaryVp).toBe(3);
    expect(preview.secondaryVp).toBe(1);
    expect(preview.totalVp).toBe(4);
  });

  it("is all zero in round 1", () => {
    const m = makeMatch(draft({ primaryVp: 3, scoredSecondaryIds: ["2"] }), 1);
    expect(previewRound(m, 1)).toEqual({ primaryVp: 0, secondaryVp: 0, totalVp: 0 });
  });
});
