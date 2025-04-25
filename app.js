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

  // Инициализация игры
  function init() {
    clearInterval(timerId);
    board = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0; secs = 0; mins = 0;
    spawn(); spawn();
    render();
    updateScore();
    updateTimer();
    startTimer();
  }

  // Спавн плитки
  function spawn() {
    const empties = [];
    board.forEach((row, r) => row.forEach((v, c) => { if (!v) empties.push([r, c]); }));
    if (!empties.length) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  // Рендер поля
  function render() {
    boardEl.innerHTML = '';
    board.forEach(row => {
      row.forEach(v => {
        const tile = document.createElement('div');
        tile.className = 'tile new';
        if (v) {
          tile.textContent = v;
          const hue = Math.log2(v) * 30;
          tile.style.background = `hsl(${hue},70%,60%)`;
        }
        boardEl.appendChild(tile);
      });
    });
  }

  // Логика движения и слияния
  function move(dir) {
    let moved = false;
    const mergeLine = line => {
      const filtered = line.filter(v => v);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          score += filtered[i];
          filtered[i + 1] = 0;
        }
      }
      // здесь фикс: обрезаем до длины size
      return filtered.filter(v => v).concat(Array(size).fill(0)).slice(0, size);
    };

    for (let i = 0; i < size; i++) {
      // Горизонтальный
      if (dir === 'left' || dir === 'right') {
        const row = dir === 'left' ? board[i] : [...board[i]].reverse();
        const merged = mergeLine(row);
        if (dir === 'right') merged.reverse();
        if (merged.toString() !== board[i].toString()) {
          board[i] = merged;
          moved = true;
        }
      } 
      // Вертикальный
      else {
        let col = board.map(r => r[i]);
        if (dir === 'down') col.reverse();
        const merged = mergeLine(col);
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
      spawn();
      render();
      updateScore();
    }
  }

  // Обновление счёта
  function updateScore() {
    scoreEl.textContent = score;
  }

  // Таймер
  function startTimer() {
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

  // Обработчики
  document.addEventListener('keydown', e => {
    const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
    if (map[e.key]) move(map[e.key]);
  });
  newBtn.addEventListener('click', init);
  themeBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

  // Старт
  init();
});
