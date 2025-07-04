import { useState, useEffect } from "react"

export const Board = () => {

    const [gridSize, setGridSize] = useState(5); // user set variable: how large they want the grid to be
    const [mSquare, setMSquare] = useState("10"); // user set variable: how many squares to memorize
    const [flashedIndexes, setFlashedIndexes] = useState([]); // the squares that will flash
    const [selectedIndexes, setSelectedIndexes] = useState([]); // user clicks
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameStatus, setGameStatus] = useState("idle"); // idle | flashing | playing | won | lost

    const totalCells = gridSize * gridSize;
    const gridArray = Array.from({ length: totalCells})

    // game start -> on clicking "memorize" button
    const handleStart = () => {
        if (gameStatus !== "idle") return;

        const chosen = new Set();
        const num = Math.min(Number(mSquare), totalCells);
        while (chosen.size < num) {
            chosen.add(Math.floor(Math.random() * totalCells));
        }

        setFlashedIndexes(Array.from(chosen));
        setGameStatus("flashing");

        setTimeout(() => {
            setGameStatus("playing");
        }, 3000);
    };

    const handleSquareClick = (idx) => {
        if (gameStatus !== "playing" || selectedIndexes.includes(idx)) return;

        if (flashedIndexes.includes(idx)) {
            setSelectedIndexes((prev) => [...prev, idx]);

            // Check if all correct guesses have been made
            const correctSoFar = [...selectedIndexes, idx].filter(i =>
            flashedIndexes.includes(i)
            );
            if (correctSoFar.length === flashedIndexes.length) {
            setGameStatus("won");
            setTimeout(() => {
                setGameStatus("idle");
                resetGame();
            }, 1000); // 1s green flash
            }
        } else {
            setSelectedIndexes((prev) => [...prev, idx]);
            setWrongGuesses((prev) => {
            const newWrong = prev + 1;
            if (newWrong >= 3) {
                setGameStatus("lost");

                setTimeout(() => {
                setGameStatus("idle");
                resetGame();
                }, 2000); // 2s green flash

            }
            return newWrong;
            });
        }
    };

    // callback function to reset game
    const resetGame = () => {
        setSelectedIndexes([]);
        setFlashedIndexes([]);
        setWrongGuesses(0);
        setIsGameOver(false);
        setGameStatus("idle");
    };

    // timer clean-up
    useEffect(() => {
        if (gameStatus === "won") {
            const timeout = setTimeout(() => {
            resetGame();
            }, 1000);
            return () => clearTimeout(timeout);
        }
        if (gameStatus === "lost") {
            const timeout = setTimeout(() => {
            resetGame();
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [gameStatus]);



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
                    <label htmlFor="mSquare" className="m-2 block text-md font-medium mb-1">
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
                disabled={gameStatus !== "idle"}
                className={`m-2 p-2 h-15 hover:scale-[1.02]  border rounded cursor-pointer transition-colors duration-200 ease-in-out ${
                            gameStatus !== "idle" ? "bg-gray-500 cursor-not-allowed" : "bg-sky-700"
                        }`}
                onClick={handleStart}
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
                        onClick={() => handleSquareClick(idx)}
                        className={`w-15 h-15 border border-gray-600 rounded transition-colors duration-300 
                            ${
                            gameStatus === "flashing" && flashedIndexes.includes(idx)
                            ? "bg-white animate-pluse"
                            : gameStatus === "won" && flashedIndexes.includes(idx)
                            ? "bg-green-500"
                            : gameStatus === "lost" && flashedIndexes.includes(idx) && !selectedIndexes.includes(idx)
                            ? "bg-green-500"
                            : selectedIndexes.includes(idx) && flashedIndexes.includes(idx)
                            ? "bg-white"
                            : selectedIndexes.includes(idx) && !flashedIndexes.includes(idx)
                            ? "bg-red"
                            : "bg-gray-800"
                        }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}