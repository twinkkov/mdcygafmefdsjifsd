let board = [];
let newGameButton = document.getElementById('new-game');
let timerDisplay = document.getElementById('timer');
let timer;
let timeElapsed = 0;

const gridSize = 4;
let gameOver = false;

newGameButton.addEventListener('click', startNewGame);

function startNewGame() {
  initializeBoard();
  startTimer();
}

function initializeBoard() {
  board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  spawnTile();
  spawnTile();
  updateBoardDisplay();
  gameOver = false;
}

function spawnTile() {
  const emptyCells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ row: r, col: c });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateBoardDisplay() {
  let boardElement = document.getElementById('board');
  boardElement.innerHTML = ''; // Clear the board

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let tileValue = board[i][j];
      if (tileValue === 0) continue;

      let tile = document.createElement('div');
      tile.classList.add('tile');
      tile.textContent = tileValue;
      tile.style.gridColumnStart = j + 1;
      tile.style.gridRowStart = i + 1;
      boardElement.appendChild(tile);
    }
  }
}

function startTimer() {
  timeElapsed = 0;
  if (timer) clearInterval(timer);

  timer = setInterval(function() {
    timeElapsed++;
    timerDisplay.textContent = timeElapsed;
  }, 1000);
}

// Movement and merging logic
document.addEventListener('keydown', (event) => {
  if (gameOver) return;

  switch (event.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
  }

  spawnTile();
  updateBoardDisplay();

  if (isGameOver()) {
    gameOver = true;
    clearInterval(timer);
    alert("Game Over!");
  }
});

function moveUp() {
  for (let c = 0; c < gridSize; c++) {
    let column = [];
    for (let r = 0; r < gridSize; r++) {
      if (board[r][c] !== 0) column.push(board[r][c]);
    }
    column = merge(column);
    for (let r = 0; r < gridSize; r++) {
      board[r][c] = column[r] || 0;
    }
  }
}

function moveDown() {
  for (let c = 0; c < gridSize; c++) {
    let column = [];
    for (let r = gridSize - 1; r >= 0; r--) {
      if (board[r][c] !== 0) column.push(board[r][c]);
    }
    column = merge(column);
    for (let r = gridSize - 1; r >= 0; r--) {
      board[r][c] = column[gridSize - r - 1] || 0;
    }
  }
}

function moveLeft() {
  for (let r = 0; r < gridSize; r++) {
    let row = [];
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] !== 0) row.push(board[r][c]);
    }
    row = merge(row);
    for (let c = 0; c < gridSize; c++) {
      board[r][c] = row[c] || 0;
    }
  }
}

function moveRight() {
  for (let r = 0; r < gridSize; r++) {
    let row = [];
    for (let c = gridSize - 1; c >= 0; c--) {
      if (board[r][c] !== 0) row.push(board[r][c]);
    }
    row = merge(row);
    for (let c = gridSize - 1; c >= 0; c--) {
      board[r][c] = row[gridSize - c - 1] || 0;
    }
  }
}

function merge(array) {
  let result = [];
  let i = 0;

  while (i < array.length) {
    if (array[i] === array[i + 1]) {
      result.push(array[i] * 2);
      i += 2;
    } else {
      result.push(array[i]);
      i++;
    }
  }

  return result;
}

function isGameOver() {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] === 0) return false;
      if (r < gridSize - 1 && board[r][c] === board[r + 1][c]) return false;
      if (c < gridSize - 1 && board[r][c] === board[r][c + 1]) return false;
    }
  }
  return true;
}

// Starting the first game
startNewGame();
