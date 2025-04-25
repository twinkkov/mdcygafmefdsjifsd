document.addEventListener('DOMContentLoaded', () => {
  const size = 4;
  let board = [];
  let score = 0;
  let secs = 0, mins = 0, timerId;

  const boardEl   = document.getElementById('board');
  const scoreEl   = document.getElementById('score');
  const timerEl   = document.getElementById('timer');
  const newBtn    = document.getElementById('new-game-btn');
  const themeBtn  = document.getElementById('theme-toggle');

  // Создаёт пустое поле и две стартовые плитки
  function init() {
    clearInterval(timerId);
    board = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0; secs = 0; mins = 0;
    addTile();
    addTile();
    render();
    updateScore();
    updateTimer();
    startTimer();
  }

  // Клонирование сетки
  function cloneGrid(g) {
    return g.map(row => row.slice());
  }

  // Сжатие одной строки: удаляем нули и добиваем нулями справа
  function compress(row) {
    const filtered = row.filter(v => v !== 0);
    return filtered.concat(Array(size - filtered.length).fill(0));
  }

  // Слияние одной строки (после сжатия), начисление очков
  function merge(row) {
    for (let i = 0; i < size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row[i + 1] = 0;
      }
    }
    return row;
  }

  // Движение влево по строке
  function moveLeft(grid) {
    return grid.map(row => {
      const c = compress(row);
      const m = merge(c);
      return compress(m);
    });
  }

  // Поворот сетки 90° по часовой
  function rotate(grid) {
    const newGrid = Array.from({ length: size }, () => Array(size).fill(0));
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        newGrid[c][size - r - 1] = grid[r][c];
      }
    }
    return newGrid;
  }

  // Обработка любого движения: left/up/right/down
  function move(dir) {
    let newGrid;
    switch (dir) {
      case 'left':
        newGrid = moveLeft(board);
        break;
      case 'up':
        newGrid = rotate(rotate(rotate(board)));
        newGrid = moveLeft(newGrid);
        newGrid = rotate(newGrid);
        break;
      case 'right':
        newGrid = rotate(rotate(board));
        newGrid = moveLeft(newGrid);
        newGrid = rotate(rotate(newGrid));
        break;
      case 'down':
        newGrid = rotate(board);
        newGrid = moveLeft(newGrid);
        newGrid = rotate(rotate(rotate(newGrid)));
        break;
      default:
        return;
    }

    // Проверяем, изменилось ли
    if (JSON.stringify(board) !== JSON.stringify(newGrid)) {
      board = newGrid;
      addTile();
      render();
      updateScore();
    }
  }

  // Спавн новой плитки (2 или 4) в рандомном пустом месте
  function addTile() {
    const empties = [];
    board.forEach((row, r) => row.forEach((v, c) => {
      if (v === 0) empties.push([r, c]);
    }));
    if (empties.length === 0) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  // Рендер сетки в DOM
  function render() {
    boardEl.innerHTML = '';
    board.forEach(row => {
      row.forEach(val => {
        const tile = document.createElement('div');
        tile.className = 'tile new';             // для pop-in css
        if (val) {
          tile.textContent = val;
          const hue = Math.log2(val) * 30;
          tile.style.background = `hsl(${hue},70%,60%)`;
        }
        boardEl.appendChild(tile);
      });
    });
  }

  // Обновляем счёт
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

  // Слушатели
  document.addEventListener('keydown', e => {
    const map = {
      ArrowLeft:  'left',
      ArrowRight: 'right',
      ArrowUp:    'up',
      ArrowDown:  'down'
    };
    if (map[e.key]) move(map[e.key]);
  });
  newBtn.addEventListener('click', init);
  themeBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

  // Старт
  init();
});
