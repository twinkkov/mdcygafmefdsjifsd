// Инициализация игрового поля
const gameContainer = document.getElementById('game-container');
const newGameButton = document.getElementById('new-game-button');

// Размер поля
const gridSize = 4;

// Состояние игры
let board = [];
let gameOver = false;

// Инициализация поля
function initializeBoard() {
  board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
  spawnTile();
  spawnTile();
  renderBoard();
  gameOver = false;
}

// Отрисовка игрового поля
function renderBoard() {
  gameContainer.innerHTML = ''; // Очистить контейнер
  board.forEach(row => {
    row.forEach(cell => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      if (cell !== 0) {
        cellElement.textContent = cell;
        cellElement.setAttribute('data-value', cell);
      }
      gameContainer.appendChild(cellElement);
    });
  });
}

// Спавн новой плитки
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

// Обработка нажатий клавиш
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
  renderBoard();

  // Проверка на конец игры
  if (isGameOver()) {
    gameOver = true;
    alert("Game Over!");
  }
});

// Логика движения и слияния плиток
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

// Функция для слияния плиток
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

// Проверка на конец игры
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

// Сброс игры
newGameButton.addEventListener('click', () => {
  initializeBoard();
});

// Запуск игры
initializeBoard();
