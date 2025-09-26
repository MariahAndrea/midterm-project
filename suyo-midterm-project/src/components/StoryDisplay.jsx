import {useContext} from 'react';
import {GameContext} from "../store/GameContext.jsx";

export default function StoryDisplay(){
    const {story, currentNode, makeChoice, player, gameOver, victory, restartGame} = useContext(GameContext);

    if (!story) return <p>Loading story...</p>

    if (gameOver) {
        return (
            <div>
                <h2>Game Over</h2>
                <p>You have died to the hands of aswangs</p>
                <button onClick={restartGame}>Play Again</button>
            </div>
        );
    }

    if (victory) {
        return (
            <div>
                <h2>Victory!</h2>
                <p>Congratulations, you survived!</p>
                <button onClick={restartGame}>Play Again</button>
            </div>
        );
    }

    const node = story[currentNode];
    console.log("Current Node: ", currentNode);

    return(
        <>
        <div className="playerInfo">
            <h2>{player.name}</h2>
            <h2>HP: {player.hp}</h2>
            <h2>Inventory: {player.inventory}</h2>
        </div>
        
        <div className="storyDetails">
            <div className="storyText">
                <p>{node.text}</p>
            </div>
            <div className="choices">
                {node.choices.map((choice, i) => (
                    <button key={i} onClick={() => makeChoice(choice)}>
                        {choice.text}
                    </button>
                ))}
            </div>
        </div>
        </>
    );
}

