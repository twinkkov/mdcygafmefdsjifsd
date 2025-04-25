let board = [];
let score = 0;
let gameStarted = false;
let timer;
let seconds = 0;
let minutes = 0;

const boardSize = 4;
const tileColors = {
    2: "#f2b179",
    4: "#f59563",
    8: "#f67c5f",
    16: "#f65e3b",
    32: "#f4cf63",
    64: "#f3c330",
    128: "#edcc2b",
    256: "#edc21d",
    512: "#edc085",
    1024: "#edc22e",
    2048: "#edc12b"
};

function startNewGame() {
    score = 0;
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    createNewTile();
    createNewTile();
    updateBoard();
    gameStarted = true;
    seconds = 0;
    minutes = 0;
    updateTimer();
    startTimer();
    document.getElementById("new-game").style.display = 'none'; // Скрываем кнопку "Новая игра" после старта
}

function createNewTile() {
    const emptyTiles = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 0) {
                emptyTiles.push({ row, col });
            }
        }
    }
    if (emptyTiles.length === 0) return;
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const newValue = Math.random() > 0.9 ? 4 : 2;
    board[randomTile.row][randomTile.col] = newValue;
    updateBoard();
}

function updateBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const tileValue = board[row][col];
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            tileElement.textContent = tileValue === 0 ? '' : tileValue;
            if (tileValue !== 0) {
                tileElement.style.backgroundColor = tileColors[tileValue];
            }
            boardElement.appendChild(tileElement);
        }
    }
    document.getElementById("score").textContent = `Очки: ${score}`;
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        updateTimer();
    }, 1000);
}

function updateTimer() {
    document.getElementById("timer").textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

document.getElementById("theme-toggle-btn").addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});

// Инициализация игры при загрузке
window.onload = startNewGame;

// Включаем кнопку "Новая игра" после окончания игры
function gameOver() {
    clearInterval(timer);
    document.getElementById("new-game").style.display = 'block'; // Показываем кнопку "Новая игра"
}
