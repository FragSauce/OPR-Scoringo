/**
 * Core domain types for an OPR Scoringo match.
 *
 * Each app instance tracks a SINGLE player ("you"). The player enters how many primary
 * VP they scored each round directly (they apply the mission rules themselves); the app
 * just tallies it alongside the secondary missions it manages.
 */

export type PrimaryMissionId = "take-and-hold" | "conquest" | "search-and-destroy";

/** Flags describing the OPPONENT's army list, used to filter conditional secondaries. */
export interface ArmyFlags {
  /** Opponent's army contains at least one Hero unit. */
  hasHero: boolean;
  /** Opponent's army contains at least one unit with Tough 6+. */
  hasTough6: boolean;
  /** Opponent's army contains 15 or more models. */
  has15Models: boolean;
}

/** The phase of the round-flow state machine. */
export type MatchPhase =
  /** Start of a round (2+): draw/discard secondaries. */
  | "draw"
  /** End of a round: enter inputs and tick scored secondaries. */
  | "score"
  /** The final round has been committed; show results. */
  | "gameOver";

/** The player's inputs for the round currently being scored. */
export interface RoundDraft {
  /** Primary-mission VP you scored this round (you apply the mission rules yourself). */
  primaryVp: number;
  /** Secondary card ids you marked as scored this round. */
  scoredSecondaryIds: string[];
}

/** A committed round's record, including computed secondary VP. */
export interface RoundRecord extends RoundDraft {
  round: number;
  secondaryVp: number;
}

export interface Match {
  /** Schema version for forward-compatible persistence. */
  version: number;
  /** The chosen primary mission (for display/reference; VP is entered manually). */
  primaryMissionId: PrimaryMissionId;
  /** VP awarded for each scored secondary mission. */
  secondaryVpValue: number;
  /** Total rounds in the game (OPR standard = 4). */
  totalRounds: number;
  /** The opponent's army features (used to filter your secondary draws). */
  opponentFlags: ArmyFlags;

  /** Your secondary-card piles. */
  deck: string[];
  hand: string[];
  discard: string[];

  /** Running totals. */
  totalVp: number;
  primaryVp: number;
  secondaryVp: number;

  currentRound: number;
  phase: MatchPhase;
  /** Committed round history. */
  history: RoundRecord[];
  /** Inputs for the round being scored, before COMMIT_ROUND. */
  draft: RoundDraft;
}
