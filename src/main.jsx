import React, { useMemo, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const BASE_FUNCS = {
  sin: x => Math.sin(x),
  cos: x => Math.cos(x),
  tan: x => Math.tan(x),
  asin: x => Math.asin(x),
  acos: x => Math.acos(x),
  atan: x => Math.atan(x),
  sqrt: x => Math.sqrt(x),
  abs: x => Math.abs(x),
  exp: x => Math.exp(x),
  ln: x => Math.log(x),
  log: x => Math.log10(x),
  floor: x => Math.floor(x),
  ceil: x => Math.ceil(x),
  round: x => Math.round(x),
  fact: n => {
    if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error('Factorial domain')
    let r = 1
    for (let i = 2; i <= n; i++) r *= i
    return r
  }
}

function formatNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Error'
  if (value === 0) return '0'
  const abs = Math.abs(value)
  if (abs >= 1e12 || (abs > 0 && abs < 1e-10)) return value.toExponential(6)
  return Number(value.toFixed(10)).toString()
}

function withTrigMode(raw, mode) {
  let expr = raw.trim()
  if (!expr) return '0'

  expr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/'))
    .replace(/−/g, '-')
    .replace(/π/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E')
    .replace(/\bAND\b/g, '&')
    .replace(/\bOR\b/g, '|')
    .replace(/\bXOR\b/g, '^')
    .replace(/\bNOT\b/g, '~')
    .replace(/\bSHL\b/g, '<<')
    .replace(/\bSHR\b/g, '>>')
    .replace(/²/g, '**2')
    .replace(/³/g, '**3')
    .replace(/\babs\(/g, 'abs(')
    .replace(/\bceil\(/g, 'ceil(')
    .replace(/\bfloor\(/g, 'floor(')
    .replace(/\blog\(/g, 'log(')
    .replace(/\bln\(/g, 'ln(')
    .replace(/\bexp\(/g, 'exp(')
    .replace(/\bsqrt\(/g, 'sqrt(')
    .replace(/\bfact\(/g, 'fact(')

  if (mode === 'DEG') {
    expr = expr
      .replace(/sin\(/g, 'sin((Math.PI/180)*(')
      .replace(/cos\(/g, 'cos((Math.PI/180)*(')
      .replace(/tan\(/g, 'tan((Math.PI/180)*(')
      .replace(/asin\(/g, 'asin((180/Math.PI)*(')
      .replace(/acos\(/g, 'acos((180/Math.PI)*(')
      .replace(/atan\(/g, 'atan((180/Math.PI)*(')
  } else {
    expr = expr
      .replace(/sin\(/g, 'sin(')
      .replace(/cos\(/g, 'cos(')
      .replace(/tan\(/g, 'tan(')
      .replace(/asin\(/g, 'asin(')
      .replace(/acos\(/g, 'acos(')
      .replace(/atan\(/g, 'atan(')
  }

  expr = expr.replace(/\b(
      \d+(?:\.\d+)?)%/g, '($1/100)')

  return expr
}

function evaluateExpression(raw, mode) {
  let expr = withTrigMode(raw, mode)
  if (!expr || expr === '0') return 0

  const safe = `
    const F = {
      sin: x => Math.sin(x),
      cos: x => Math.cos(x),
      tan: x => Math.tan(x),
      asin: x => Math.asin(x),
      acos: x => Math.acos(x),
      atan: x => Math.atan(x),
      sqrt: x => Math.sqrt(x),
      abs: x => Math.abs(x),
      exp: x => Math.exp(x),
      ln: x => Math.log(x),
      log: x => Math.log10(x),
      floor: x => Math.floor(x),
      ceil: x => Math.ceil(x),
      round: x => Math.round(x),
      fact: n => {
        if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error('Factorial domain')
        let r = 1
        for (let i = 2; i <= n; i++) r *= i
        return r
      }
    }
    return (${expr})
  `

  const result = Function('Math', safe)({ PI: Math.PI, E: Math.E })
  if (!Number.isFinite(result)) throw new Error('Bad math input')
  return result
}

function App() {
  const [expr, setExpr] = useState('')
  const [mode, setMode] = useState('DEG')
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('logiclab-history') || '[]') } catch { return [] }
  })
  const [error, setError] = useState('')
  const [second, setSecond] = useState(false)

  useEffect(() => {
    localStorage.setItem('logiclab-history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  const preview = useMemo(() => {
    if (!expr) return '0'
    try {
      return formatNumber(evaluateExpression(expr, mode))
    } catch {
      return 'Error'
    }
  }, [expr, mode])

  const handlePress = key => {
    if (key === 'clear') {
      setError('')
      setExpr('')
      return
    }
    if (key === 'back') {
      setError('')
      setExpr(prev => prev.slice(0, -1))
      return
    }
    if (key === 'toggle') {
      setSecond(s => !s)
      return
    }
    if (key === 'equals') {
      if (!expr) return
      try {
        const result = evaluateExpression(expr, mode)
        const formatted = formatNumber(result)
        setHistory(prev => [{ expr, result: formatted, mode, time: Date.now() }, ...prev].slice(0, 20))
        setExpr(formatted)
        setError('')
      } catch (e) {
        setError(e.message || 'Bad input')
      }
      return
    }
    if (key === 'MR') {
      setExpr(prev => prev + String(memory))
      return
    }
    if (key === 'MC') {
      setMemory(0)
      return
    }
    if (key === 'M+') {
      try {
        const val = evaluateExpression(expr || '0', mode)
        setMemory(prev => prev + val)
      } catch {}
      return
    }
    if (key === 'M-') {
      try {
        const val = evaluateExpression(expr || '0', mode)
        setMemory(prev => prev - val)
      } catch {}
      return
    }
    if (key === 'sin' || key === 'cos' || key === 'tan' || key === 'asin' || key === 'acos' || key === 'atan' || key === 'ln' || key === 'log' || key === 'sqrt' || key === 'abs' || key === 'floor' || key === 'ceil') {
      setExpr(prev => prev + `${key}(`)
      setError('')
      return
    }
    if (key === 'fact') {
      setExpr(prev => prev + 'fact(')
      setError('')
      return
    }
    if (key === 'pi') {
      setExpr(prev => prev + 'π')
      return
    }
    if (key === 'e') {
      setExpr(prev => prev + 'e')
      return
    }
    if (key === '²') {
      setExpr(prev => prev + '²')
      return
    }
    if (key === '³') {
      setExpr(prev => prev + '³')
      return
    }
    if (key === '^') {
      setExpr(prev => prev + '^')
      return
    }
    if (key === 'AND' || key === 'OR' || key === 'XOR' || key === 'NOT' || key === 'SHL' || key === 'SHR') {
      setExpr(prev => prev + ` ${key} `)
      return
    }
    if (key === '0' || key === '1' || key === '2' || key === '3' || key === '4' || key === '5' || key === '6' || key === '7' || key === '8' || key === '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '(' || key === ')' || key === '%') {
      setExpr(prev => prev + key)
      setError('')
      return
    }

    if (key === '÷') { setExpr(prev => prev + '÷'); return }
    if (key === '×') { setExpr(prev => prev + '×'); return }
    if (key === '−') { setExpr(prev => prev + '−'); return }

    setExpr(prev => prev + key)
  }

  const keypad = [
    [{ label: '2nd', key: 'toggle' }, { label: 'sin', key: 'sin' }, { label: 'cos', key: 'cos' }, { label: 'tan', key: 'tan' }, { label: 'ln', key: 'ln' }, { label: 'log', key: 'log' }, { label: '(', key: '(' }, { label: ')', key: ')' }],
    [{ label: 'asin', key: 'asin', secondary: true }, { label: 'acos', key: 'acos', secondary: true }, { label: 'atan', key: 'atan', secondary: true }, { label: '√', key: 'sqrt' }, { label: 'x²', key: '²' }, { label: 'x³', key: '³' }, { label: 'xʸ', key: '^' }, { label: 'n!', key: 'fact' }],
    [{ label: 'π', key: 'pi' }, { label: 'e', key: 'e' }, { label: 'abs', key: 'abs' }, { label: 'floor', key: 'floor' }, { label: 'ceil', key: 'ceil' }, { label: '%', key: '%' }, { label: 'AC', key: 'clear', danger: true }, { label: '⌫', key: 'back', danger: true }],
    [{ label: '7', key: '7' }, { label: '8', key: '8' }, { label: '9', key: '9' }, { label: '÷', key: '÷', op: true }, { label: 'AND', key: 'AND', logic: true }, { label: 'OR', key: 'OR', logic: true }],
    [{ label: '4', key: '4' }, { label: '5', key: '5' }, { label: '6', key: '6' }, { label: '×', key: '×', op: true }, { label: 'XOR', key: 'XOR', logic: true }, { label: 'NOT', key: 'NOT', logic: true }],
    [{ label: '1', key: '1' }, { label: '2', key: '2' }, { label: '3', key: '3' }, { label: '−', key: '−', op: true }, { label: 'SHL', key: 'SHL', logic: true }, { label: 'SHR', key: 'SHR', logic: true }],
    [{ label: '0', key: '0', wide: true }, { label: '.', key: '.' }, { label: '+', key: '+' }, { label: '=', key: 'equals', eq: true, wide: true }]
  ]

  return (
    <main className="app-shell">
      <section className="calculator-panel">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">◈</span>
            <div>
              <strong>LOGICLAB</strong>
              <small>SCIENTIFIC ENGINE</small>
            </div>
          </div>
          <div className="top-actions">
            <button className="mini-btn" onClick={() => setHistory([])}>↺</button>
            <button className="mini-btn" onClick={() => document.body.classList.toggle('light')}>☼</button>
          </div>
        </header>

        <div className="display-panel">
          <div className="display-meta">
            <span>{mode} • {memory !== 0 ? 'MEMORY' : 'READY'}</span>
            <span>{second ? '2ND' : 'SCI'}</span>
          </div>
          <div className="expression">{expr || '0'}</div>
          <div className={`result ${error ? 'error' : ''}`}>{error || preview}</div>
        </div>

        <div className="toolbar">
          <button onClick={() => setMode(m => (m === 'DEG' ? 'RAD' : 'DEG'))}>{mode}</button>
          <button onClick={() => setMemory(0)}>MC</button>
          <button onClick={() => setExpr(String(memory))}>MR</button>
          <button onClick={() => setMemory(v => v + (Number(expr) || 0))}>M+</button>
          <button onClick={() => setMemory(v => v - (Number(expr) || 0))}>M−</button>
        </div>

        <div className="keypad">
          {keypad.flat().map((item, index) => (
            <button
              key={index}
              className={`key ${item.op ? 'operator' : ''} ${item.logic ? 'logic' : ''} ${item.eq ? 'equals' : ''} ${item.danger ? 'danger' : ''} ${item.wide ? 'wide' : ''} ${second && item.secondary ? 'secondary' : ''}`}
              onClick={() => handlePress(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <footer className="footer-strip">
          <span>OFFLINE READY</span>
          <span>12-DIGIT PRECISION</span>
          <span>HISTORY + LOGIC</span>
        </footer>
      </section>

      <aside className="history-panel">
        <div className="history-header">
          <div>
            <span className="eyebrow">WORKSPACE</span>
            <h2>History</h2>
          </div>
          <button onClick={() => setHistory([])}>Clear</button>
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⌁</div>
            <p>No calculations yet.</p>
            <small>Saved locally on this device.</small>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item, idx) => (
              <button key={idx} className="history-item" onClick={() => setExpr(item.expr)}>
                <span>{item.expr}</span>
                <strong>= {item.result}</strong>
                <small>{item.mode} • {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </button>
            ))}
          </div>
        )}
      </aside>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
