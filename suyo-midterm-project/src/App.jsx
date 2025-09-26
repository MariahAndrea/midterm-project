import { useContext } from 'react';
import { GameContext } from './store/GameContext';
import StartScreen from './components/StartScreen';
import StoryDisplay from './components/StoryDisplay';

export default function App() {
  const {player} = useContext(GameContext);

  return(
      <div>
        {player.name === "" ? <StartScreen/> : <StoryDisplay/>}
      </div>
  );
}

