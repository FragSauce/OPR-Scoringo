import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { matchReducer, type MatchAction } from "./matchReducer";
import type { Match } from "./matchTypes";
import { loadMatch, saveMatch } from "./persistence";

interface MatchContextValue {
  match: Match | null;
  dispatch: Dispatch<MatchAction>;
}

const MatchContext = createContext<MatchContextValue | null>(null);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [match, dispatch] = useReducer(matchReducer, null, loadMatch);

  // Persist on every change.
  useEffect(() => {
    saveMatch(match);
  }, [match]);

  return <MatchContext.Provider value={{ match, dispatch }}>{children}</MatchContext.Provider>;
}

export function useMatch(): MatchContextValue {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error("useMatch must be used within a MatchProvider");
  return ctx;
}
