const boardSize = 4;
let board = [];
let score = 0;
let timer = 0;
let intervalId;

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const newGameBtn = document.getElementById("new-game-btn");
const themeToggle = document.getElementById("theme-toggle");

function createBoard() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  addTile();
  addTile();
  updateBoard();
  resetTimer();
}

function updateBoard() {
  boardEl.innerHTML = "";
  board.forEach(row => {
    row.forEach(cell => {
      const tile = document.createElement("div");
      tile.className = "tile";
      if (cell !== 0) {
        tile.textContent = cell;
        tile.style.background = `hsl(${Math.log2(cell) * 30}, 70%, 60%)`;
      } else {
        tile.textContent = "";
      }
      boardEl.appendChild(tile);
    });
  });
}

function addTile() {
  let empty = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) empty.push([i, j]);
    });
  });
  if (empty.length === 0) return;
  const [x, y] = empty[Math.floor(Math.random() * empty.length)];
  board[x][y] = Math.random() > 0.1 ? 2 : 4;
}

function move(direction) {
  let moved = false;

  const mergeRow = row => {
    const newRow = row.filter(val => val);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    return newRow.filter(val => val).concat(Array(boardSize).fill(0)).slice(0, boardSize);
  };

  for (let i = 0; i < boardSize; i++) {
    let original, processed;
    if (direction === "left") {
      original = board[i];
      processed = mergeRow(original);
      if (original.toString() !== processed.toString()) {
        board[i] = processed;
        moved = true;
      }
    } else if (direction === "right") {
      original = [...board[i]].reverse();
      processed = mergeRow(original).reverse();
      if (board[i].toString() !== processed.toString()) {
        board[i] = processed;
        moved = true;
      }
    } else if (direction === "up" || direction === "down") {
      let col = board.map(row => row[i]);
      if (direction === "down") col = col.reverse();
      const merged = mergeRow(col);
      if (direction === "down") merged.reverse();
      for (let j = 0; j < boardSize; j++) {
        if (board[j][i] !== merged[j]) {
          board[j][i] = merged[j];
          moved = true;
        }
      }
    }
  }

  if (moved) {
    addTile();
    updateBoard();
    updateScore();
  }
}

function updateScore() {
  scoreEl.textContent = score;
}

function resetTimer() {
  clearInterval(intervalId);
  timer = 0;
  timerEl.textContent = `${timer}s`;
  intervalId = setInterval(() => {
    timer++;
    timerEl.textContent = `${timer}s`;
  }, 1000);
}

function handleKey(e) {
  const key = e.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    move(key.replace("Arrow", "").toLowerCase());
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

document.addEventListener("keydown", handleKey);
newGameBtn.addEventListener("click", createBoard);
themeToggle.addEventListener("click", toggleTheme);

createBoard();
