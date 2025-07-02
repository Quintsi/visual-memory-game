import { useState } from "react"

export const Board = () => {

    const [gridSize, setGridSize] = useState(5);

    // Should have a resizeable grid layout that can flash white and user can select their picks at which cell flashed
    return (
        <div>
            <input 
            className="gridInput"
            type="range"
            min="3"
            max="12"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            />
            <span>{gridSize} x {gridSize}</span>
        </div>
    )
}