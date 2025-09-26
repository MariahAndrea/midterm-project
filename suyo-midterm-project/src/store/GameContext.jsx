import React, {useState, useEffect, useContext, createContext} from 'react';

export const GameContext = createContext();

export function GameProvider({children}) {

    const savedState = JSON.parse(localStorage.getItem("gameState"));

    const[player, setPlayer] = useState(
        savedState?.player || { name: "", hp: 100, inventory: []}
        
    );

    const [story, setStory] = useState(null);
    const [currentNode, setCurrentNode] = useState(savedState?.currentNode || "start");
    const [gameOver, setGameOver] = useState(savedState?.gameOver || false);
    const [victory, setVictory] = useState(savedState?.victory || false);

    useEffect(() => {
        fetch("files/story.json")
        .then((res) => res.json())
        .then((data) => setStory(data));
    }, []);

    useEffect(() => {
        const gameState = { player, currentNode, gameOver, victory };
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }, [player, currentNode, gameOver, victory]);

    function makeChoice(choice) {
        const nextNode = story[choice.to];
        
        if (nextNode.onArrive){
            if (nextNode.onArrive.takeDamage) {
                setPlayer((p) =>{
                    const newHp = p.hp - nextNode.onArrive.takeDamage;
                    console.log(`Player HP changed: ${p.hp} -> ${newHp}`);
                    if (newHp <= 0) {
                        setGameOver(true);
                        return { ...p, hp: 0 };
                    }
                    return { ...p, hp: newHp };
                });
            }

            if (nextNode.onArrive.addItem) {
                console.log(`Item added: ${nextNode.onArrive.addItem}`);
                setPlayer((p) => ({
                    ...p,
                    inventory: [ ...p.inventory, nextNode.onArrive.addItem]
                }));
            }
        }

        if (nextNode.isEnding){
            if (nextNode.type === "goodEnding"){
                setVictory(true);
            }
            else {
                setGameOver(true);
            }
        }

        setCurrentNode(choice.to);
    }

    function restartGame(){
        setPlayer({ name: "", hp: 100, inventory: [] });
        setCurrentNode("start");
        setGameOver(false);
        setVictory(false);
        localStorage.removeItem("gameState");
        console.log("Game restarted");
    }


    return(
        <GameContext.Provider
            value={{
                player,
                setPlayer,
                story,
                currentNode,
                makeChoice,
                gameOver,
                victory,
                restartGame
            }}
        >
            {children}
        </GameContext.Provider>
    );
}