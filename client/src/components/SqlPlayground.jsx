import { useState, useEffect, useRef } from 'react'
import initSqlJs from 'sql.js'

const INIT_SQL = `-- Try running your own SQL queries!
-- Sample tables are already loaded: employees, departments, orders, customers

SELECT * FROM employees;
`

const SEED_SQL = `
CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY, department_name TEXT, location TEXT
);
INSERT OR IGNORE INTO departments VALUES (1, 'Sales', 'New York');
INSERT OR IGNORE INTO departments VALUES (2, 'IT', 'San Francisco');
INSERT OR IGNORE INTO departments VALUES (3, 'HR', 'Chicago');

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, salary REAL,
  gender TEXT, hire_date TEXT, email TEXT, phone TEXT, manager_id INTEGER
);
INSERT OR IGNORE INTO employees VALUES (1, 'Alice', 1, 50000, 'Female', '2020-03-15', 'alice@company.com', '555-0100', NULL);
INSERT OR IGNORE INTO employees VALUES (2, 'Bob', 2, 60000, 'Male', '2021-06-01', 'bob@company.com', '555-0101', 1);
INSERT OR IGNORE INTO employees VALUES (3, 'Charlie', 3, 45000, 'Male', '2022-01-10', 'charlie@company.com', NULL, 1);
INSERT OR IGNORE INTO employees VALUES (4, 'Dana', 2, 75000, 'Female', '2019-11-20', 'dana@company.com', '555-0102', 1);
INSERT OR IGNORE INTO employees VALUES (5, 'Eve', 1, 48000, 'Female', '2023-04-05', 'eve@old.com', NULL, NULL);

CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY, name TEXT);
INSERT OR IGNORE INTO customers VALUES (1, 'Acme Corp');
INSERT OR IGNORE INTO customers VALUES (2, 'Globex Inc');

CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL, order_date TEXT);
INSERT OR IGNORE INTO orders VALUES (1, 1, 100, '2024-01-01');
INSERT OR IGNORE INTO orders VALUES (2, 1, 150, '2024-01-02');
INSERT OR IGNORE INTO orders VALUES (3, 2, 200, '2024-01-03');

CREATE TABLE IF NOT EXISTS contractors (id INTEGER PRIMARY KEY, name TEXT);
INSERT OR IGNORE INTO contractors VALUES (1, 'Charlie');
INSERT OR IGNORE INTO contractors VALUES (2, 'Frank');
`

export default function SqlPlayground({ selectedDbms, onClose }) {
  const [sql, setSql] = useState(INIT_SQL)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [running, setRunning] = useState(false)
  const [dbReady, setDbReady] = useState(false)
  const [message, setMessage] = useState('')
  const dbRef = useRef(null)

  useEffect(() => { initDb() }, [])

  async function initDb() {
    try {
      const SQL = await initSqlJs({
        locateFile: file => 'https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/sql-wasm.wasm'
      })
      const db = new SQL.Database()
      db.run(SEED_SQL)
      dbRef.current = db
      setDbReady(true)
      setMessage('Sample database ready! Run any SQL query below.')
    } catch (err) {
      setError('Failed to load SQL executor: ' + err.message)
    }
  }

  function runQuery() {
    const db = dbRef.current
    if (!db) return
    setRunning(true)
    setError(null)
    setResults([])
    setMessage('')

    try {
      const trimmed = sql.trim().replace(/;$/, '')
      if (!trimmed) { setMessage('Please enter a SQL query.'); setRunning(false); return }

      const statements = trimmed.split(';').map(s => s.trim()).filter(Boolean)
      if (statements.length === 0) { setMessage('Please enter a SQL query.'); setRunning(false); return }

      const lastResults = []

      for (const stmt of statements) {
        const upper = stmt.toUpperCase()

        if (upper.startsWith('SELECT') || upper.startsWith('PRAGMA') || upper.startsWith('EXPLAIN')) {
          try {
            const result = db.exec(stmt)
            const rows = []
            for (const r of result) {
              for (let i = 0; i < r.values.length; i++) {
                const row = {}
                r.columns.forEach((col, j) => { row[col] = r.values[i][j] })
                rows.push(row)
              }
            }
            lastResults.push({ type: 'select', columns: result.length > 0 ? result[0].columns : [], rows })
          } catch (e) {
            setError('Query error: ' + e.message)
            setRunning(false); return
          }
        } else {
          try {
            db.run(stmt)
            const changes = db.getRowsModified()
            lastResults.push({ type: 'modify', message: `${changes} row(s) affected.` })
          } catch (e) {
            setError('Error: ' + e.message)
            setRunning(false); return
          }
        }
      }

      if (lastResults.length > 0) {
        setResults(lastResults)
        const sc = lastResults.filter(r => r.type === 'select').length
        const mc = lastResults.filter(r => r.type === 'modify').length
        const parts = []
        if (sc > 0) parts.push(`${sc} SELECT result(s)`)
        if (mc > 0) parts.push(`${mc} modification(s)`)
        setMessage(parts.join(', ') || 'Query executed.')
      } else {
        setMessage('Query executed. No results returned.')
      }
    } catch (err) {
      setError('Execution error: ' + err.message)
    } finally {
      setRunning(false)
    }
  }

  function resetDb() {
    try {
      const SQL = dbRef.current?.constructor
      if (!SQL) return
      const db = new (SQL.Database)()
      db.run(SEED_SQL)
      dbRef.current = db
      setError(null)
      setResults([])
      setMessage('Database reset to initial state!')
    } catch (err) {
      setError('Reset error: ' + err.message)
    }
  }

  function loadExample(exampleSql) {
    setSql(exampleSql)
    setError(null)
    setResults([])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <span className="text-lg">▶️</span>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>SQL Playground</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Write and run SQL queries against sample data</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ color: 'var(--color-text-muted)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!dbReady && !error && (
          <div className="flex items-center justify-center p-12" style={{ color: 'var(--color-text-secondary)' }}>
            <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mr-3" />
            Loading SQL engine...
          </div>
        )}

        {error && !dbReady && (
          <div className="p-12 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            <p className="text-red-400 mb-2">⚠️ {error}</p>
            <p className="text-xs">Try refreshing the page.</p>
          </div>
        )}

        {dbReady && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <textarea value={sql} onChange={e => setSql(e.target.value)}
                className="w-full font-mono text-sm p-4 rounded-xl resize-none"
                style={{ backgroundColor: 'var(--color-code-bg)', color: 'var(--color-text)', border: '1px solid var(--color-code-border)', minHeight: '160px', fontFamily: "'JetBrains Mono', monospace" }}
                spellCheck={false}
              />

              {message && (
                <div className="text-xs p-2 rounded-lg" style={{
                  backgroundColor: error ? 'rgba(239,68,68,0.1)' : message.includes('reset') ? 'rgba(99,102,241,0.1)' : 'rgba(34,197,94,0.1)',
                  color: error ? '#ef4444' : message.includes('reset') ? '#818cf8' : '#22c55e',
                }}>{message}</div>
              )}

              {results.map((r, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
                  {r.type === 'select' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                            {r.columns.map(col => (
                              <th key={col} className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {r.rows.map((row, ri) => (
                            <tr key={ri} style={{ borderTop: '1px solid var(--color-border)' }}>
                              {r.columns.map(col => (
                                <td key={col} className="px-3 py-1.5 font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                                  {row[col] === null ? <span style={{ color: '#ef4444' }}>NULL</span> : String(row[col])}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-3 py-1.5 text-xs" style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg)' }}>
                        {r.rows.length} row(s) returned
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-xs" style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg)' }}>{r.message}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t shrink-0 space-y-3" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex flex-wrap gap-2">
                <button onClick={runQuery} disabled={running} className="btn-primary text-sm flex items-center gap-1.5">
                  {running ? (
                    <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Running...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg> Run</>
                  )}
                </button>
                <button onClick={resetDb} className="btn-secondary text-sm">Reset Data</button>
                <button onClick={() => loadExample('SELECT d.department_name, COUNT(e.id) as emp_count\nFROM departments d\nLEFT JOIN employees e ON e.department_id = d.id\nGROUP BY d.department_name;')} className="btn-secondary text-sm">Load JOIN Example</button>
                <button onClick={() => loadExample('SELECT name, salary, RANK() OVER (ORDER BY salary DESC) as rank FROM employees;')} className="btn-secondary text-sm">Load Window Example</button>
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Powered by SQLite (sql.js). Some MySQL/PostgreSQL/Oracle-specific syntax may not run here.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
