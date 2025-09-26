import React, {useState, useContext} from 'react';
import {GameContext} from "../store/GameContext";

export default function StartScreen(){
    const {setPlayer} = useContext(GameContext);
    const [name, setName] = useState("");

function handleStart(){
    setPlayer((p) => ({...p, name}));
}

return (
    <div>
        <h1>Aswang Hunter</h1>
        <input 
            type = "text"
            placeholder = "Enter your name"
            value = {name}
            onChange = {(e) => setName(e.target.value)}
        />
        <button onClick={handleStart}>Start</button>
    </div>
);
}