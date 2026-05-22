const DIFFICULTY_STYLES = {
  basic: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', dot: '#22c55e' },
  intermediate: { bg: 'rgba(234,179,8,0.1)', text: '#eab308', dot: '#eab308' },
  advanced: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', dot: '#ef4444' },
  interview: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', dot: '#a855f7' },
}

const DBMS_COLORS = { sqlite: '#22c55e', mysql: '#f59e0b', postgres: '#3b82f6', oracle: '#ef4444' }

export default function QueryCard({ query, selectedDbms, isSelected, onClick }) {
  const dc = DIFFICULTY_STYLES[query.difficulty] || DIFFICULTY_STYLES.basic

  const getCode = () => {
    const map = { sqlite: query.sql_code, mysql: query.mysql_code, postgres: query.postgres_code, oracle: query.oracle_code }
    return map[selectedDbms] || query.sql_code
  }

  return (
    <button
      onClick={onClick}
      className="glass-card p-5 text-left card-hover cursor-pointer"
      style={isSelected ? { boxShadow: '0 0 0 2px ' + DBMS_COLORS[selectedDbms] + '80' } : {}}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold leading-snug pr-4" style={{ color: 'var(--color-text)' }}>
          {query.title}
        </h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium shrink-0`}
          style={{ backgroundColor: dc.bg, color: dc.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dc.dot }} />
          {query.difficulty}
        </div>
      </div>

      <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
        {query.description}
      </p>

      <div className="code-block p-3" style={{ backgroundColor: 'var(--color-bg)' }}>
        <pre className="font-mono text-xs whitespace-pre-wrap line-clamp-3" style={{ color: 'var(--color-text)' }}>
          {getCode()}
        </pre>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: query.category_color, backgroundColor: query.category_color + '15' }}>
            {query.category_name}
          </span>
          {selectedDbms !== 'sqlite' && (
            <span className="text-xs" style={{ color: DBMS_COLORS[selectedDbms] }}>
              {selectedDbms}
            </span>
          )}
        </div>
        {query.question && (
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>📝 Q&A</span>
        )}
      </div>
    </button>
  )
}
