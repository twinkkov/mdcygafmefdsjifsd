document.addEventListener('DOMContentLoaded', () => {
  const boardSize = 4;
  let board = [];
  let score = 0;
  let timerSec = 0;
  let timerMin = 0;
  let timerId = null;

  const boardEl = document.getElementById('board');
  const scoreEl = document.getElementById('score');
  const timerEl = document.getElementById('timer');
  const newGameBtn = document.getElementById('new-game-btn');
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Функция создания пустого поля и двух стартовых плиток
  function initGame() {
    clearInterval(timerId);
    timerSec = 0; timerMin = 0;
    score = 0;
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    spawnTile();
    spawnTile();
    updateBoard();
    updateScore();
    updateTimerDisplay();
    startTimer();
  }

  // Спавн новой плитки 2 или 4
  function spawnTile() {
    const empties = [];
    board.forEach((row, r) => row.forEach((v, c) => { if (v === 0) empties.push([r, c]); }));
    if (!empties.length) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  // Обновление DOM-поля
  function updateBoard() {
    boardEl.innerHTML = '';
    board.forEach(row => {
      row.forEach(val => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (val) {
          tile.textContent = val;
          // динамический цвет градации
          const hue = Math.log2(val) * 30;
          tile.style.background = `hsl(${hue}, 70%, 60%)`;
        }
        boardEl.appendChild(tile);
      });
    });
  }

  // Обновление счёта
  function updateScore() {
    scoreEl.textContent = score;
  }

  // Таймер
  function startTimer() {
    timerId = setInterval(() => {
      timerSec++;
      if (timerSec === 60) { timerSec = 0; timerMin++; }
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const mm = timerMin.toString().padStart(2, '0');
    const ss = timerSec.toString().padStart(2, '0');
    timerEl.textContent = `${mm}:${ss}`;
  }

  // Логика движения и слияния
  function move(dir) {
    let moved = false;
    const mergeLine = line => {
      const filtered = line.filter(v => v);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i+1]) {
          filtered[i] *= 2;
          score += filtered[i];
          filtered[i+1] = 0;
        }
      }
      return filtered.filter(v => v).concat(Array(boardSize).fill(0));
    };
    for (let i = 0; i < boardSize; i++) {
      let line;
      if (dir === 'left' || dir === 'right') {
        line = dir === 'left' ? board[i] : [...board[i]].reverse();
        const merged = mergeLine(line);
        if (dir === 'right') merged.reverse();
        if (merged.toString() !== board[i].toString()) {
          board[i] = merged;
          moved = true;
        }
      } else {
        line = board.map(r => r[i]);
        if (dir === 'down') line.reverse();
        const merged = mergeLine(line);
        if (dir === 'down') merged.reverse();
        merged.forEach((v, idx) => {
          if (board[idx][i] !== v) {
            board[idx][i] = v;
            moved = true;
          }
        });
      }
    }
    if (moved) {
      spawnTile();
      updateBoard();
      updateScore();
    }
  }

  // Обработчик клавиш
  document.addEventListener('keydown', e => {
    const m = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' }[e.key];
    if (m) move(m);
  });

  // Кнопки
  newGameBtn.addEventListener('click', initGame);
  themeToggleBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

  // Старт
  initGame();
});
