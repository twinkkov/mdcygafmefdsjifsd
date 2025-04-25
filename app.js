document.addEventListener('DOMContentLoaded', () => {
  const size     = 4;
  let board      = [];
  let score      = 0;
  let secs       = 0, mins = 0, timerId;
  let startX     = 0, startY = 0;
  const threshold = 30; // порог для свайпа

  const boardEl   = document.getElementById('board');
  const scoreEl   = document.getElementById('score');
  const timerEl   = document.getElementById('timer');
  const newBtn    = document.getElementById('new-game-btn');
  const themeBtn  = document.getElementById('theme-toggle');

  // Инициализация игры
  function init() {
    clearInterval(timerId);
    board = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0; secs = 0; mins = 0;
    addTile(); addTile();
    render();
    updateScore();
    updateTimer();
    startTimer();
  }

  // Добавление новой плитки
  function addTile() {
    const empties = [];
    board.forEach((row, r) =>
      row.forEach((v, c) => { if (v === 0) empties.push([r, c]); })
    );
    if (!empties.length) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  // Отрисовка поля
  function render() {
    boardEl.innerHTML = '';
    board.forEach(row =>
      row.forEach(val => {
        const tile = document.createElement('div');
        tile.className = 'tile new';
        const inner = document.createElement('div');
        inner.className = 'value';
        if (val) {
          inner.textContent = val;
          const hue = Math.log2(val) * 30;
          tile.style.background = `hsl(${hue},70%,60%)`;
        }
        tile.appendChild(inner);
        boardEl.appendChild(tile);
      })
    );
  }

  // Сжатие строки
  function compress(row) {
    const filtered = row.filter(v => v !== 0);
    return filtered.concat(Array(size - filtered.length).fill(0));
  }

  // Слияние строк
  function merge(row) {
    for (let i = 0; i < size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row[i + 1] = 0;
        // анимация merge
        // можно добавить: mark for merge
      }
    }
    return row;
  }

  // Движение влево
  function moveLeft(grid) {
    return grid.map(row => compress(merge(compress(row))));
  }

  // Поворот сетки на 90°
  function rotate(grid) {
    const newGrid = Array.from({ length: size }, () => Array(size).fill(0));
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        newGrid[c][size - r - 1] = grid[r][c];
      }
    }
    return newGrid;
  }

  // Универсальное движение
  function move(dir) {
    let newGrid;
    switch (dir) {
      case 'left':
        newGrid = moveLeft(board);
        break;
      case 'right':
        newGrid = rotate(rotate(moveLeft(rotate(rotate(board)))));
        break;
      case 'up':
        newGrid = rotate(moveLeft(rotate(rotate(rotate(board)))));
        break;
      case 'down':
        newGrid = rotate(rotate(rotate(moveLeft(rotate(board)))));
        break;
      default:
        return;
    }
    if (JSON.stringify(board) !== JSON.stringify(newGrid)) {
      board = newGrid;
      addTile();
      render();
      updateScore();
    }
  }

  // Обновить счёт
  function updateScore() {
    scoreEl.textContent = score;
  }

  // Таймер
  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      secs++;
      if (secs === 60) { secs = 0; mins++; }
      updateTimer();
    }, 1000);
  }
  function updateTimer() {
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    timerEl.textContent = `${mm}:${ss}`;
  }

  // Клавиши стрелок
  document.addEventListener('keydown', e => {
    const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
    if (map[e.key]) move(map[e.key]);
  });

  // Свайпы для мобильных
  boardEl.addEventListener('touchstart', e => {
    const t = e.changedTouches[0];
    startX = t.clientX;
    startY = t.clientY;
  }, { passive: true });

  boardEl.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      move(dx > 0 ? 'right' : 'left');
    } else if (Math.abs(dy) > threshold) {
      move(dy > 0 ? 'down' : 'up');
    }
  }, { passive: true });

  // Кнопки UI
  newBtn.addEventListener('click', init);
  themeBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

  // Старт игры
  init();
});
