@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap');

:root {
  --bg-1: #070d18;
  --bg-2: #0f1d30;
  --panel: rgba(15, 25, 42, 0.82);
  --panel-2: rgba(19, 33, 55, 0.88);
  --screen: linear-gradient(180deg, rgba(12, 20, 36, 0.95), rgba(8, 15, 28, 1));
  --line: rgba(125, 193, 255, 0.18);
  --text: #ebf7ff;
  --muted: #7b95b8;
  --cyan: #6be3ff;
  --cyan-soft: rgba(107, 227, 255, 0.16);
  --teal: #5ef1d1;
  --violet: #8f7cff;
  --rose: #ff7ca4;
  --shadow: 0 25px 70px rgba(2, 6, 18, 0.7);
}

* { box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; min-width: 320px; }
body {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 12% 0%, rgba(107, 227, 255, 0.18), transparent 30%),
    radial-gradient(circle at 100% 100%, rgba(143, 124, 255, 0.2), transparent 30%),
    linear-gradient(135deg, var(--bg-1), var(--bg-2));
}
body.light { filter: brightness(1.12) saturate(1.1); }
button { font: inherit; }

.app-shell {
  width: min(1240px, 100%);
  min-height: 100vh;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: minmax(0, 760px) 320px;
  gap: 20px;
  align-items: center;
}

.calculator-panel, .history-panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 28px;
  box-shadow: var(--shadow), inset 0 1px rgba(255,255,255,.05);
  backdrop-filter: blur(18px);
}

.calculator-panel { padding: 22px; }
.history-panel { padding: 22px 18px; }

.topbar, .history-header, .display-meta, .toolbar, .footer-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand { display: flex; gap: 12px; align-items: center; }
.brand-mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(107,227,255,0.2), rgba(143,124,255,.22));
  border: 1px solid rgba(107,227,255,.35);
  box-shadow: 0 0 24px rgba(107,227,255,.18);
  font-size: 1.2rem;
}
.brand strong {
  display: block;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
}
.brand small, .eyebrow {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  letter-spacing: 0.18em;
  font-size: 0.58rem;
}

.top-actions { display: flex; gap: 8px; }
.mini-btn, .history-header button {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  color: var(--muted);
  border-radius: 10px;
  padding: 8px 10px;
  min-width: 38px;
}

.display-panel {
  margin-top: 22px;
  padding: 18px 20px 18px;
  border-radius: 22px;
  background: var(--screen);
  border: 1px solid rgba(118,214,255,.16);
  box-shadow: inset 0 0 25px rgba(30, 120, 172, 0.1);
}

.display-meta {
  color: var(--muted);
  font-family: 'DM Mono', monospace;
  letter-spacing: 0.14em;
  font-size: 0.56rem;
  text-transform: uppercase;
}

.expression {
  min-height: 56px;
  margin-top: 22px;
  text-align: right;
  color: #d3ebff;
  font-family: 'DM Mono', monospace;
  font-size: clamp(1rem, 2vw, 1.8rem);
  word-break: break-all;
  white-space: pre-wrap;
}

.result {
  margin-top: 10px;
  min-height: 58px;
  text-align: right;
  color: #f7fcff;
  font-family: 'DM Mono', monospace;
  font-size: clamp(2rem, 4vw, 3.2rem);
  word-break: break-all;
  text-shadow: 0 0 18px rgba(107,227,255,.25);
}

.result.error { color: var(--rose); font-size: 1.2rem; }

.toolbar {
  gap: 8px;
  margin-top: 16px;
}

.toolbar button {
  flex: 1;
  padding: 10px 8px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
}

.keypad {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 10px;
}

.key {
  min-height: 54px;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
  color: var(--text);
  font-weight: 600;
  font-size: 0.8rem;
  transition: transform .12s ease, border-color .12s ease;
}
.key:hover { transform: translateY(-2px); border-color: rgba(107,227,255,.35); }
.key.operator { background: linear-gradient(180deg, rgba(143,124,255,.18), rgba(143,124,255,.08)); }
.key.logic { background: linear-gradient(180deg, rgba(94,241,209,.12), rgba(94,241,209,.05)); }
.key.equals { background: linear-gradient(180deg, rgba(94,241,209,.3), rgba(107,227,255,.12)); }
.key.danger { background: linear-gradient(180deg, rgba(255,124,164,.15), rgba(255,124,164,.06)); }
.key.wide { grid-column: span 2; }

.footer-strip {
  gap: 8px;
  margin-top: 16px;
  color: var(--muted);
  font-family: 'DM Mono', monospace;
  font-size: 0.54rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.footer-strip span:first-child { color: var(--teal); }

.history-panel { min-height: 620px; }
.history-header {
  gap: 10px;
}
.history-header h2 {
  margin: 8px 0 0;
  font-size: 1.7rem;
}

.empty-state {
  display: grid;
  place-items: center;
  min-height: 480px;
  color: var(--muted);
  text-align: center;
}
.empty-icon { font-size: 3rem; color: var(--teal); }
.empty-state p { margin: 12px 0 0; }
.empty-state small { opacity: 0.8; }

.history-list {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 560px;
  overflow: auto;
}

.history-item {
  width: 100%;
  text-align: left;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 14px;
  padding: 12px 12px 10px;
  color: var(--text);
}
.history-item span,
.history-item strong,
.history-item small { display: block; }
.history-item span {
  color: var(--muted);
  font-family: 'DM Mono', monospace;
  font-size: 0.64rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.history-item strong {
  margin-top: 8px;
  font-family: 'DM Mono', monospace;
  font-size: 1.1rem;
}
.history-item small {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.58rem;
}

@media (max-width: 1000px) {
  .app-shell {
    grid-template-columns: 1fr;
    max-width: 760px;
  }
  .history-panel { min-height: auto; }
}

@media (max-width: 620px) {
  .app-shell { padding: 12px; }
  .calculator-panel, .history-panel { border-radius: 20px; }
  .keypad { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .key { min-height: 50px; }
}
