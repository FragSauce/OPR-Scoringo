import type { PrimaryMissionId } from "../state/matchTypes";

export interface PrimaryMission {
  id: PrimaryMissionId;
  name: string;
  /** Short summary shown on the picker. */
  summary: string;
  /** Full scoring rules text. */
  rules: string;
}

export const PRIMARY_MISSIONS: PrimaryMission[] = [
  {
    id: "take-and-hold",
    name: "Take and Hold",
    summary: "Score for holding objectives, more so than your opponent.",
    rules:
      "At the end of each round after the first you score:\n" +
      "• 1 VP if you control at least 1 objective\n" +
      "• 1 VP if you control at least 2 objectives\n" +
      "• 1 VP if you control more objectives than your opponent",
  },
  {
    id: "conquest",
    name: "Conquest",
    summary: "A single big payout for objectives held at the end of round 4.",
    rules:
      "At the end of round 4, each player scores 3 VP for each objective under their control, " +
      "to a maximum of 9 VP.",
  },
  {
    id: "search-and-destroy",
    name: "Search and Destroy",
    summary: "Score for out-objecting and out-killing your opponent.",
    rules:
      "At the end of each round after the first you score:\n" +
      "• 2 VP if you control more objectives than your opponent\n" +
      "• 2 VP if you destroyed more units this round than your opponent",
  },
];

export function getPrimaryMission(id: PrimaryMissionId): PrimaryMission {
  const found = PRIMARY_MISSIONS.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown primary mission: ${id}`);
  return found;
}

export interface SecondaryMission {
  /** Stable id (the card number as a string, "1".."12"). */
  id: string;
  number: number;
  name: string;
  /** Full condition text shown on the card. */
  text: string;
  /**
   * If set, the card is auto-discarded and redrawn when the opponent's army does
   * NOT have the named feature.
   */
  requiresOpponentHero?: boolean;
  requiresOpponentTough6?: boolean;
  requiresOpponent15Models?: boolean;
}

export const SECONDARY_MISSIONS: SecondaryMission[] = [
  {
    id: "1",
    number: 1,
    name: "Assassination",
    requiresOpponentHero: true,
    text:
      "If your opponent has no Hero unit in their army list, discard this and draw a new card.\n\n" +
      "You score this mission if:\n" +
      "• You killed a Hero unit during this round\n" +
      "• There are no enemy Heroes left on the battlefield",
  },
  {
    id: "2",
    number: 2,
    name: "Hold Objective 1",
    text: "You score this mission by controlling Objective 1.",
  },
  {
    id: "3",
    number: 3,
    name: "Hold Objective 2",
    text: "You score this mission by controlling Objective 2.",
  },
  {
    id: "4",
    number: 4,
    name: "Hold Objective 3",
    text: "You score this mission by controlling Objective 3.",
  },
  {
    id: "5",
    number: 5,
    name: "Mental Warfare",
    text:
      "You score this mission if:\n" +
      "• One of the enemy units failed a Morale Check\n" +
      "• One of your units succeeded a Morale Check",
  },
  {
    id: "6",
    number: 6,
    name: "Marked for Death",
    text:
      "When you draw this mission, your opponent must mark 3 of their units; they stay marked " +
      "as long as you hold this card.\n\n" +
      "You score this mission if one of the marked units has been destroyed.",
  },
  {
    id: "7",
    number: 7,
    name: "Engage on all Fronts",
    text: 'You score this mission if you have units fully within 3 of the 4 table quarters.',
  },
  {
    id: "8",
    number: 8,
    name: "No Prisoners",
    text: "You score this mission if you destroyed 2 or more enemy units during this round.",
  },
  {
    id: "9",
    number: 9,
    name: "Bring it Down",
    requiresOpponentTough6: true,
    text:
      "If your opponent has no Tough 6 or higher unit in their army list, discard this and draw a new card.\n\n" +
      "You score this mission if:\n" +
      "• You destroyed an enemy unit with Tough 6 or higher\n" +
      "• There are no enemy units with Tough 6 or higher",
  },
  {
    id: "10",
    number: 10,
    name: "Storm Hostile Objective",
    text:
      "You score this mission if you control an objective that your enemy controlled at the start of the round.",
  },
  {
    id: "11",
    number: 11,
    name: "Behind Enemy Lines",
    text:
      "You score this mission if you have a unit (excluding aircraft) within your opponent's deployment zone.",
  },
  {
    id: "12",
    number: 12,
    name: "Cull the Horde",
    requiresOpponent15Models: true,
    text:
      "If your opponent has less than 15 models in their army list, discard this and draw a new card.\n\n" +
      "You score this mission if:\n" +
      "• You killed 15 or more models during this round\n" +
      "• Your opponent doesn't have 15 or more models on the board",
  },
];

const SECONDARY_BY_ID = new Map(SECONDARY_MISSIONS.map((m) => [m.id, m]));

export function getSecondaryMission(id: string): SecondaryMission {
  const found = SECONDARY_BY_ID.get(id);
  if (!found) throw new Error(`Unknown secondary mission: ${id}`);
  return found;
}
