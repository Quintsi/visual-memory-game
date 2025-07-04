import { useState } from "react"

export const Board = () => {

    const [gridSize, setGridSize] = useState(5);
    const [mSquare, setMSquare] = useState("10");
    const [flashedIndexes, setFlashedIndexes] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([]); // user clicks
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameStatus, setGameStatus] = useState("idle"); // idle | flashing | playing | won | lost

    const totalCells = gridSize * gridSize;
    const gridArray = Array.from({ length: totalCells})

    const handleClick = () => {
        const num = Math.min(Number(mSquare), totalCells);

        const chosen = new Set();
        while (chosen.size < num) {
            const randomIndex = Math.floor(Math.random() * totalCells);
            chosen.add(randomIndex);
        }

        const indexes = Array.from(chosen);
        setFlashedIndexes(indexes);

        // Remove flashes after 3 seconds
        setTimeout(() => {
            setFlashedIndexes([]);
        }, 3000);

    }

    // Should have a resizeable grid layout that can flash white and user can select their picks at which cell flashed
    return (
        <div className="text-white">
            <div className="flex w-fit p-2">
                <div className="p-4">
                    <label htmlFor="gridSize" className="block text-md font-medium mb-1">
                        Grid Size: {gridSize} x {gridSize}
                    </label>
                    <input
                        id="gridSize"
                        type="range"
                        min="3"
                        max="12"
                        value={gridSize}
                        onChange={(e) => setGridSize(Number(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div className="p-4 flex">
                    <label htmlFor="mSquare" className="block text-md font-medium mb-1">
                        Squares to Memorize :
                    </label>
                    <input
                        id="mSquare"
                        type="text"
                        value={mSquare}
                        onChange={(e) => setMSquare(Number(e.target.value))}
                        className="px-2 w-25 h-10 border border-white rounded"
                    />
                </div>

                <button
                className="p-2 border bg-cyan-500 rounded cursor-pointer"
                onClick={handleClick}
                >
                Memorize!
                </button>

            </div>
            <div className="p-2 w-fit">
                <div
                    className="grid gap-1 cursor-pointer"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                    }}
                    >
                    {gridArray.map((_, idx) => (
                        <div
                        key={idx}
                        className={`w-15 h-15 border border-gray-600 rounded transition-colors duration-300 ${
                            flashedIndexes.includes(idx) ? "bg-white" : "bg-gray-800"
                        }`}
                        onClick={() => handleClick(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}