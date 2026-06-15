import { SECONDARY_MISSIONS } from "../data/missions";
import { buildDeck, drawUntil, isPlayable, makeRng, shuffle } from "./deck";
import type { ArmyFlags } from "./matchTypes";

const ALL_TRUE: ArmyFlags = { hasHero: true, hasTough6: true, has15Models: true };
const ALL_FALSE: ArmyFlags = { hasHero: false, hasTough6: false, has15Models: false };

describe("shuffle / buildDeck", () => {
  it("builds a deck of all 12 unique card ids", () => {
    const deck = buildDeck(makeRng(1));
    expect(deck).toHaveLength(SECONDARY_MISSIONS.length);
    expect(new Set(deck).size).toBe(SECONDARY_MISSIONS.length);
  });

  it("is deterministic for a fixed seed and does not mutate input", () => {
    const input = ["a", "b", "c", "d"];
    const out1 = shuffle(input, makeRng(42));
    const out2 = shuffle(input, makeRng(42));
    expect(out1).toEqual(out2);
    expect(input).toEqual(["a", "b", "c", "d"]); // unchanged
  });
});

describe("isPlayable", () => {
  it("treats conditional cards as unplayable when the opponent lacks the feature", () => {
    expect(isPlayable("1", ALL_FALSE)).toBe(false); // Assassination needs a Hero
    expect(isPlayable("9", ALL_FALSE)).toBe(false); // Bring it Down needs Tough 6+
    expect(isPlayable("12", ALL_FALSE)).toBe(false); // Cull the Horde needs 15+ models
    expect(isPlayable("2", ALL_FALSE)).toBe(true); // plain card always playable
  });

  it("treats conditional cards as playable when the opponent has the feature", () => {
    expect(isPlayable("1", ALL_TRUE)).toBe(true);
    expect(isPlayable("9", ALL_TRUE)).toBe(true);
    expect(isPlayable("12", ALL_TRUE)).toBe(true);
  });
});

describe("drawUntil", () => {
  it("draws up to the target", () => {
    const result = drawUntil(
      { deck: ["2", "3", "4", "5"], hand: [], discard: [] },
      3,
      ALL_TRUE,
      makeRng(1),
    );
    expect(result.hand).toHaveLength(3);
    expect(result.deck).toHaveLength(1);
  });

  it("auto-skips conditional cards the opponent doesn't qualify for", () => {
    const result = drawUntil(
      { deck: ["1", "9", "2"], hand: [], discard: [] },
      1,
      ALL_FALSE,
      makeRng(1),
    );
    expect(result.hand).toEqual(["2"]);
    expect(result.skipped).toEqual(["1", "9"]);
    expect(result.discard).toEqual(["1", "9"]);
  });

  it("reshuffles the discard pile when the deck empties", () => {
    const result = drawUntil(
      { deck: [], hand: [], discard: ["2", "3"] },
      1,
      ALL_TRUE,
      makeRng(1),
    );
    expect(result.hand).toHaveLength(1);
    expect(["2", "3"]).toContain(result.hand[0]);
  });

  it("does not add a card already held in hand (sets it aside instead)", () => {
    // Contrived: "2" appears in both deck and hand (can happen after a reshuffle).
    const result = drawUntil(
      { deck: ["2", "5"], hand: ["2"], discard: [] },
      2,
      ALL_TRUE,
      makeRng(1),
    );
    expect(result.hand).toEqual(["2", "5"]);
    expect(new Set(result.hand).size).toBe(2); // no duplicates
    expect(result.discard).toEqual(["2"]); // the duplicate was set aside
  });
});
