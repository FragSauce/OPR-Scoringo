import { Scoreboard } from "./components/Scoreboard";
import { SetupScreen } from "./components/SetupScreen";
import { MatchProvider, useMatch } from "./state/useMatch";

function Game() {
  const { match } = useMatch();
  return match ? <Scoreboard match={match} /> : <SetupScreen />;
}

export default function App() {
  return (
    <MatchProvider>
      <Game />
    </MatchProvider>
  );
}
