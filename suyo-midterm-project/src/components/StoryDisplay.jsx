import {useContext} from 'react';
import {GameContext} from "../store/GameContext.jsx";

export default function StoryDisplay(){
    const {story, 
        currentNode, 
        makeChoice, 
        player, 
        gameOver, 
        victory, 
        restartGame, 
        hasRequiredItems
    } = useContext(GameContext);

    if (!story) return <p>Loading story...</p>

    if (gameOver) {
        return (
            <div className="gameOverScreen">
                <h2>Game Over</h2>
                <p>You have died to the hands of aswang.</p>
                <button onClick={restartGame}>PLAY AGAIN</button>
            </div>
        );
    }

    if (victory) {
        return (
            <div className="victoryScreen">
                <h2>Victory!</h2>
                <p>Congratulations, you successfully defeated the aswang!</p>
                <button onClick={restartGame}>PLAY AGAIN</button>
            </div>
        );
    }

    const node = story[currentNode];
    console.log("Current Node: ", currentNode);

    return(
        <div className={`storyScreen ${currentNode}`}>

            <div className="storyContainer">
                <div className="storyDetails">
                    <div className="storyText">
                        <p>{node.text}</p>
                    </div>
                    <div className="choices">
                        <ul>
                            {node.choices.map((choice, i) => {
                                //filters choices based on req items
                                const canShow = hasRequiredItems(choice, player.inventory);
                                
                                console.log(
                                    `Choice ${i + 1}: "${choice.text}" is`,
                                    canShow ? "SHOWN" : "HIDDEN (missing requirements)"
                                );

                                if (!canShow) return null;

                                return(
                                    <li key={i}>
                                        <button key={i} onClick={() => makeChoice(choice)}>
                                            {choice.text}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        
                    </div>
                </div>

                <div className="playerInfo">
                    <h2 className="playerName">{player.name}</h2>
                    <h2><span className="hpText">HP: </span>{player.hp}</h2>
                    <h2><span className="inventoryText">Inventory: </span>
                    <ul className="itemList">
                        {player.inventory.length > 0 ? (
                            player.inventory.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))
                        ): (
                            <li>(empty)</li>
                        )}
                        
                    </ul>
                    </h2>
                </div>
            </div>

            
            
        </div>
    );
}

