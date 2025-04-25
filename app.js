document.addEventListener('DOMContentLoaded', () => {
  const size      = 4;
  let board       = [];
  let score       = 0;
  let secs        = 0, mins = 0, timerId;
  let startX      = 0, startY = 0;
  const threshold = 30;

  const boardEl   = document.getElementById('board');
  const scoreEl   = document.getElementById('score');
  const timerEl   = document.getElementById('timer');
  const newBtn    = document.getElementById('new-game-btn');
  const themeBtn  = document.getElementById('theme-toggle');

  function init() {
    clearInterval(timerId);
    board = Array.from({ length: size }, () => Array(size).fill(0));
    score = 0; secs = 0; mins = 0;
    addTile(); addTile();
    render(); updateScore(); updateTimer(); startTimer();
  }

  function addTile() {
    const empties = [];
    board.forEach((row, r) =>
      row.forEach((v, c) => { if (v === 0) empties.push([r, c]); })
    );
    if (!empties.length) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

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

  function compress(row) {
    const filtered = row.filter(v => v !== 0);
    return filtered.concat(Array(size - filtered.length).fill(0));
  }

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

  function moveLeft(grid) {
    return grid.map(r => compress(merge(compress(r))));
  }

  function rotate(grid) {
    return Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) =>
        grid[size - c - 1][r]
      )
    );
  }

  function move(dir) {
    let ng;
    switch (dir) {
      case 'left':
        ng = moveLeft(board);
        break;
      case 'right':
        ng = rotate(rotate(moveLeft(rotate(rotate(board)))));
        break;
      case 'up':
        ng = rotate(moveLeft(rotate(rotate(rotate(board)))));
        break;
      case 'down':
        ng = rotate(rotate(rotate(moveLeft(rotate(board)))));
        break;
      default:
        return;
    }
    if (JSON.stringify(board) !== JSON.stringify(ng)) {
      board = ng;
      addTile();
      render();
      updateScore();
    } else {
      boardEl.classList.add('shake');
      boardEl.addEventListener('animationend', () => {
        boardEl.classList.remove('shake');
      }, { once: true });
    }
  }

  function updateScore() {
    scoreEl.textContent = score;
  }

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

  document.addEventListener('keydown', e => {
    const map = {
      ArrowLeft:  'left',
      ArrowRight: 'right',
      ArrowUp:    'up',
      ArrowDown:  'down'
    };
    if (map[e.key]) move(map[e.key]);
  });

  boardEl.addEventListener('touchstart', e => {
    const t = e.changedTouches[0];
    startX = t.clientX; startY = t.clientY;
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

  newBtn.addEventListener('click', init);
  themeBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

  init();
});
