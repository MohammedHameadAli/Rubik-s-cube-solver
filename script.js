const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
let selectedColor = 'U';

// Setup color picker buttons
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedColor = btn.dataset.color;
    document.querySelectorAll('.color-btn').forEach(b => b.style.outline = '');
    btn.style.outline = '2px solid #fff';
  });
});

// Set default selected color (white / 'U')
document.querySelector('.white').click();

// Create face tiles
faceOrder.forEach(face => {
  const container = document.getElementById(face);
  for (let i = 0; i < 9; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    if (i === 4) {
      tile.dataset.color = face; // center color
      tile.style.background = getColor(face);
      tile.classList.add('center');
    } else {
      tile.dataset.color = '';
      tile.addEventListener('click', () => {
        tile.dataset.color = selectedColor;
        tile.style.background = getColor(selectedColor);
        updateCounters();
      });
    }

    container.appendChild(tile);
  }
});

// Mapping face letters to CSS color names
function getColor(ch) {
  return {
    U: 'white',
    R: 'red',
    F: 'green',
    D: 'yellow',
    L: 'orange',
    B: 'blue'
  }[ch];
}

// Update color counters and solve button state
function updateCounters() {
  const counts = { U: 0, R: 0, F: 0, D: 0, L: 0, B: 0 };
  document.querySelectorAll('.tile').forEach(t => {
    const c = t.dataset.color;
    if (c) counts[c]++;
  });

  faceOrder.forEach(c => {
    document.getElementById('count-' + c).textContent = `${c}: ${counts[c]}`;
  });

  const allNine = Object.values(counts).every(cnt => cnt === 9);
  document.getElementById('solve-btn').disabled = !allNine;
}

// Solve cube
async function solveCube() {
  const facelets = faceOrder.map(f =>
    Array.from(document.getElementById(f).children)
      .map(t => t.dataset.color).join('')
  ).join('');

  try {
    await Cube.initSolver(); // initialize solver
    const cube = Cube.fromString(facelets);
    const sol = cube.solve();
    document.getElementById('solution').textContent = sol;
  } catch (e) {
    document.getElementById('solution').textContent = "Invalid cube configuration!";
    console.error(e);
  }
}

// Initial call to display counters on load
updateCounters();
