import React, {useState, useEffect, useCallback, createContext} from 'react';

export const GameContext = createContext();

export function GameProvider({children}) {

    //loads progress from localStorage
    const savedState = JSON.parse(localStorage.getItem("gameState"));

    const[player, setPlayer] = useState(
        savedState?.player || { name: "", hp: 100, inventory: []}
    );

    const [story, setStory] = useState(null);
    const [currentNode, setCurrentNode] = useState(savedState?.currentNode || "start");
    const [gameOver, setGameOver] = useState(savedState?.gameOver || false);
    const [victory, setVictory] = useState(savedState?.victory || false);

    //loads json file
    useEffect(() => {
        fetch("files/story.json")
        .then((res) => res.json())
        .then((data) => setStory(data));
    }, []);

    //saves progress to local storage
    useEffect(() => {
        const gameState = { player, currentNode, gameOver, victory };
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }, [player, currentNode, gameOver, victory]);

    //checks req item 
    function hasRequiredItems(choice, inventory){
        if (!choice.requires) return true;
        if (Array.isArray(choice.requires)) {
            return choice.requires.every((item) => inventory.includes(item));
        }
        return inventory.includes(choice.requires);
    }

    const makeChoice = useCallback((choice) => {

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
            if (choice.to === "goodEnding"){
                setVictory(true);
            }
            else {
                setGameOver(true);
            }
        }

        setCurrentNode(choice.to);
    }, [story]);

    const restartGame = useCallback(() => {
        setPlayer({ name: "", hp: 100, inventory: [] });
        setCurrentNode("start");
        setGameOver(false);
        setVictory(false);
        localStorage.removeItem("gameState");
        console.log("Game restarted");
    }, []);

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
                restartGame,
                hasRequiredItems
            }}
        >
            {children}
        </GameContext.Provider>
    );
}