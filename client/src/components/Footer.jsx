export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">S</div>
              <span className="font-bold" style={{ color: 'var(--color-text)' }}>Shikav</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}> by Kavish Ghumre</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Your interactive platform for learning SQL, Java, and .NET. Master database queries across SQLite, MySQL, PostgreSQL, and Oracle.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Quick Links</h4>
            <ul className="space-y-2">
              {['Topics', 'Queries', 'SQL Playground', 'SQL Basics'].map(link => (
                <li key={link}>
                  <a href={link === 'SQL Playground' ? '#queries' : '#categories'} className="text-sm transition-colors" style={{ color: 'var(--color-text-muted)' }}
                    onMouseOver={e => e.target.style.color = '#818cf8'}
                    onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>DBMS Supported</h4>
            <ul className="space-y-2">
              {[
                { name: 'SQLite', color: '#22c55e' },
                { name: 'MySQL', color: '#f59e0b' },
                { name: 'PostgreSQL', color: '#3b82f6' },
                { name: 'Oracle', color: '#ef4444' },
              ].map(db => (
                <li key={db.name}>
                  <span className="text-sm" style={{ color: db.color }}>{db.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 text-center border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            &copy; {new Date().getFullYear()} Shikav [by Kavish Ghumre]. Built with ❤️ for the SQL community.
          </p>
        </div>
      </div>
    </footer>
  )
}
