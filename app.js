const { useState, useEffect } = React;

const SIZE = 4;

const App = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [score, setScore] = useState(0);

  useEffect(() => {
    addRandomTile(board, setBoard);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') moveUp();
    if (e.key === 'ArrowDown') moveDown();
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
  };

  const addRandomTile = (board, setBoard) => {
    const emptyCells = [];
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] === 0) emptyCells.push([row, col]);
      }
    }
    if (emptyCells.length === 0) return;
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = [...board];
    newBoard[row][col] = Math.random() > 0.1 ? 2 : 4;
    setBoard(newBoard);
  };

  const moveUp = () => { /* Логика для движения вверх */ };
  const moveDown = () => { /* Логика для движения вниз */ };
  const moveLeft = () => { /* Логика для движения влево */ };
  const moveRight = () => { /* Логика для движения вправо */ };

  return (
    <div className="container mx-auto mt-5">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold">2048</h1>
        <h2 className="text-2xl mt-2">Score: {score}</h2>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={`w-20 h-20 flex items-center justify-center bg-${cell === 0 ? 'gray-400' : 'blue-500'} rounded-lg text-xl`}>
              {cell !== 0 ? cell : ''}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

const createEmptyBoard = () => {
  return Array(SIZE).fill().map(() => Array(SIZE).fill(0));
};

ReactDOM.render(<App />, document.getElementById('root'));
