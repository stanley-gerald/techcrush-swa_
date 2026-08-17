// ============================================
// Terminal type-on animation (hero signature element)
// ============================================
const terminalLines = [
  { text: '$ az staticwebapp create \\', cls: 'cmd' },
  { text: '    --name techcrush-homepage \\', cls: 'cmd' },
  { text: '    --source ./techcrush-homepage', cls: 'cmd' },
  { text: '', cls: '' },
  { text: 'Preparing deployment...', cls: 'muted' },
  { text: '✓ Build succeeded', cls: 'teal' },
  { text: '✓ Static assets uploaded', cls: 'teal' },
  { text: '✓ Custom domain verified', cls: 'teal' },
  { text: '', cls: '' },
  { text: 'Deployed to techcrush.africa', cls: 'amber' },
  { text: '', cls: '' },
  { text: 'Welcome to TechCrush.', cls: 'bright' },
];

const CLASS_COLOR = {
  cmd: 'var(--text)',
  muted: 'var(--text-faint)',
  teal: 'var(--teal)',
  amber: 'var(--amber)',
  bright: 'var(--text)',
};

function typeTerminal() {
  const out = document.getElementById('terminal-output');
  if (!out) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    out.innerHTML = terminalLines
      .map(l => `<span style="color:${CLASS_COLOR[l.cls] || 'inherit'}">${l.text}</span>`)
      .join('\n');
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let rendered = '';

  function step() {
    if (lineIndex >= terminalLines.length) return;

    const line = terminalLines[lineIndex];
    const color = CLASS_COLOR[line.cls] || 'inherit';

    if (charIndex === 0 && line.text === '') {
      rendered += '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(step, 120);
      return;
    }

    if (charIndex <= line.text.length) {
      const soFar = line.text.slice(0, charIndex);
      const prevLines = terminalLines.slice(0, lineIndex).map(l =>
        `<span style="color:${CLASS_COLOR[l.cls] || 'inherit'}">${l.text}</span>`
      ).join('\n');
      out.innerHTML = prevLines + (lineIndex > 0 ? '\n' : '') +
        `<span style="color:${color}">${soFar}</span>`;
      charIndex++;
      const speed = line.cls === 'cmd' ? 18 : 10;
      setTimeout(step, speed);
    } else {
      lineIndex++;
      charIndex = 0;
      const pause = line.text.startsWith('✓') ? 140 : 60;
      setTimeout(step, pause);
    }
  }

  step();
}

// ============================================
// Pipeline rail — reflects scroll progress
// ============================================
function updateRail() {
  const fill = document.querySelector('.pipeline-rail__fill');
  if (!fill) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  fill.style.width = `${Math.min(pct, 100)}%`;
}

// ============================================
// Cohort form (placeholder — wire to real backend/Azure Function later)
// ============================================
function initForm() {
  const form = document.getElementById('cohort-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    if (!email) return;
    note.textContent = `Thanks — we'll reach out to ${email} with cohort details.`;
    note.style.color = 'var(--teal)';
    form.reset();
  });
}

// ============================================
// Init
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  typeTerminal();
  initForm();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.addEventListener('scroll', updateRail, { passive: true });
