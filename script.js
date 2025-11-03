// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

const aInputs = Array.from(document.querySelectorAll('#aInputs input'));
const bInputs = Array.from(document.querySelectorAll('#bInputs input'));
const calcBtn = document.getElementById('calcBtn');
const clearBtn = document.getElementById('clearBtn');
const logEl = document.getElementById('log');
const finalResult = document.getElementById('finalResult');

// --- helper setup ---
function setupInputs(list) {
  list.forEach((input, i) => {
    input.addEventListener('input', e => {
      let v = e.target.value.replace(/[^01]/g, '');
      e.target.value = v;
      if (v && i < list.length - 1) list[i + 1].focus();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && input.value === '' && i > 0)
        list[i - 1].focus();
    });
  });
}
setupInputs(aInputs);
setupInputs(bInputs);

// --- read bits ---
function readBits(inputs) {
  const bits = Array(4).fill('0');
  inputs.forEach(inp => {
    const idx = Number(inp.dataset.index);
    bits[idx] = inp.value === '1' ? '1' : '0';
  });
  return bits;
}

// --- full adder logic ---
function fullAdderBit(a, b, cin) {
  const ai = +a, bi = +b, c = +cin;
  const sum = (ai ^ bi ^ c) & 1;
  const cout = ((ai & bi) | (c & (ai ^ bi))) & 1;
  return { sum: String(sum), cout: String(cout) };
}

// --- clear all ---
function clearAll() {
  [...aInputs, ...bInputs].forEach(i => (i.value = ''));
  logEl.innerHTML = '';
  finalResult.textContent = '— — — — —';
}
clearBtn.addEventListener('click', clearAll);

// --- calculate button ---
calcBtn.addEventListener('click', () => {
  logEl.innerHTML = '';
  const A = readBits(aInputs);
  const B = readBits(bInputs);

  let cin = '0';
  const sums = [];
  const steps = [];

  for (let i = 0; i < 4; i++) {
    const res = fullAdderBit(A[i], B[i], cin);
    steps.push({ bit: i, a: A[i], b: B[i], cin, ...res });
    sums[i] = res.sum;
    cin = res.cout;
  }

  const resultBits = [cin, sums[3], sums[2], sums[1], sums[0]];
  finalResult.textContent = resultBits.join(' ');

  steps.forEach(s => {
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `
      <strong>Bit ${s.bit}:</strong> 
      A=${s.a}, B=${s.b}, Cin=${s.cin} → 
      Sum=${s.sum}, Cout=${s.cout}
    `;
    logEl.appendChild(div);
  });

  const summary = document.createElement('p');
  summary.className = 'summary';
  summary.innerHTML = `<strong>Final Carry + Sum = ${resultBits.join(' ')}</strong>`;
  logEl.appendChild(summary);
});
