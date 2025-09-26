import React, {useState, useContext} from 'react';
import {GameContext} from "../store/GameContext";

export default function StartScreen(){
    const {setPlayer} = useContext(GameContext);
    const [name, setName] = useState("");

function handleStart(){
    setPlayer((p) => ({...p, name}));
}

return (
    <div className="startScreen">
        <div className="startContent"> 
            <div className="title">
                <h1>Aswang Hunter</h1>
            </div>
            <div className="inputArea">
                <input 
                    type = "text"
                    placeholder = "Enter name"
                    value = {name}
                    onChange = {(e) => setName(e.target.value)}
                    />
                <div className="button">
                    <button onClick={handleStart}>START</button>
                </div>
            </div>
            
        </div>
    </div>
);
}