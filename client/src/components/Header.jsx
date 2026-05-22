import { useTheme } from '../ThemeContext'

const DBMS_OPTIONS = [
  { id: 'sqlite', label: 'SQLite', color: '#22c55e' },
  { id: 'mysql', label: 'MySQL', color: '#f59e0b' },
  { id: 'postgres', label: 'PostgreSQL', color: '#3b82f6' },
  { id: 'oracle', label: 'Oracle', color: '#ef4444' },
]

export default function Header({ searchTerm, onSearchChange, selectedDbms, onDbmsChange }) {
  const { dark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40" style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              SK
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold gradient-text">Shikav</span>
              <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>by Kavish Ghumre</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-3">
            <a href="#career" className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#14b8a6', border: '1px solid rgba(20,184,166,0.3)' }}>
              🎯 Career
            </a>
            {DBMS_OPTIONS.map(db => (
              <button
                key={db.id}
                onClick={() => onDbmsChange(db.id)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: selectedDbms === db.id ? `${db.color}20` : 'transparent',
                  color: selectedDbms === db.id ? db.color : 'var(--color-text-muted)',
                  border: `1px solid ${selectedDbms === db.id ? db.color + '40' : 'var(--color-border)'}`,
                }}
              >
                {db.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-40 lg:w-56">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="input-field pl-9 pr-3 py-2 text-xs"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--color-bg-card)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-2 pb-3 overflow-x-auto">
          {DBMS_OPTIONS.map(db => (
            <button
              key={db.id}
              onClick={() => onDbmsChange(db.id)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all"
              style={{
                backgroundColor: selectedDbms === db.id ? `${db.color}20` : 'transparent',
                color: selectedDbms === db.id ? db.color : 'var(--color-text-muted)',
                border: `1px solid ${selectedDbms === db.id ? db.color + '40' : 'var(--color-border)'}`,
              }}
            >
              {db.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
