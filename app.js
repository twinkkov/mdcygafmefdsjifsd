document.addEventListener('DOMContentLoaded', () => {
  const size = 4;
  let board = [];
  let score = 0;
  let timerSec = 0, timerMin = 0, timerId;

  const boardEl  = document.getElementById('board');
  const scoreEl  = document.getElementById('score');
  const timerEl  = document.getElementById('timer');
  const newBtn   = document.getElementById('new-game-btn');
  const themeBtn = document.getElementById('theme-toggle');

  function init() {
    clearInterval(timerId);
    score = 0; timerSec = 0; timerMin = 0;
    board = Array.from({length: size}, ()=>Array(size).fill(0));
    spawn(); spawn();
    render();
    updateScore();
    renderTimer();
    startTimer();
  }

  function spawn() {
    const empties = [];
    board.forEach((r, i) => r.forEach((v, j) => !v && empties.push([i,j])));
    if (!empties.length) return;
    const [r,c] = empties[Math.floor(Math.random()*empties.length)];
    board[r][c] = Math.random()>0.9 ? 4 : 2;
  }

  function render() {
    boardEl.innerHTML = '';
    board.forEach((row, i) => {
      row.forEach((v, j) => {
        const tile = document.createElement('div');
        tile.className = 'tile new';  // каждое рендерение — popIn
        const val  = document.createElement('div');
        val.className = 'value';
        if (v) {
          val.textContent = v;
          // динамический цвет через HSL
          tile.style.background = `hsl(${Math.log2(v)*30},70%,60%)`;
        }
        tile.appendChild(val);
        boardEl.appendChild(tile);
      });
    });
  }

  function move(dir) {
    let moved = false;
    const mergeLine = line => {
      const filtered = line.filter(v=>v);
      for (let i=0; i<filtered.length-1; i++){
        if(filtered[i]===filtered[i+1]){
          filtered[i]*=2;
          score += filtered[i];
          filtered[i+1]=0;
        }
      }
      return filtered.filter(v=>v).concat(Array(size).fill(0));
    };
    for (let i=0; i<size; i++){
      let line;
      if(dir==='left'||dir==='right'){
        line = dir==='left'? board[i] : [...board[i]].reverse();
        const merged = mergeLine(line);
        if(dir==='right') merged.reverse();
        if(merged.toString()!==board[i].toString()){
          board[i]=merged; moved=true;
        }
      } else {
        let col = board.map(r=>r[i]);
        if(dir==='down') col.reverse();
        const merged = mergeLine(col);
        if(dir==='down') merged.reverse();
        merged.forEach((v, idx)=> {
          if(board[idx][i]!==v){ board[idx][i]=v; moved=true; }
        });
      }
    }
    if(moved){
      spawn();
      render();
      updateScore();
    }
  }

  function updateScore() {
    scoreEl.textContent = score;
  }

  function startTimer() {
    timerId = setInterval(()=>{
      timerSec++;
      if(timerSec===60){ timerSec=0; timerMin++; }
      renderTimer();
    },1000);
  }
  function renderTimer(){
    const mm = String(timerMin).padStart(2,'0');
    const ss = String(timerSec).padStart(2,'0');
    timerEl.textContent = `${mm}:${ss}`;
  }

  document.addEventListener('keydown', e=>{
    const keyMap = {
      ArrowLeft: 'left', ArrowRight: 'right',
      ArrowUp: 'up', ArrowDown: 'down'
    };
    if(keyMap[e.key]) move(keyMap[e.key]);
  });
  newBtn.addEventListener('click', init);
  themeBtn.addEventListener('click', ()=> document.body.classList.toggle('dark'));

  init();
});
