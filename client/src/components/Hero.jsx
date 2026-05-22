const HERO_CONTENT = {
  sql: {
    tag: 'Interactive SQL Learning Platform',
    tagColor: '#818cf8',
    title: <>Master SQL from<br /><span className="gradient-text">Zero to Hero</span></>,
    desc: (
      <>
        Explore 138 carefully crafted SQL queries with real-world examples across{' '}
        <span style={{ color: '#22c55e' }}>SQLite</span>,{' '}
        <span style={{ color: '#f59e0b' }}>MySQL</span>,{' '}
        <span style={{ color: '#3b82f6' }}>PostgreSQL</span>, and{' '}
        <span style={{ color: '#ef4444' }}>Oracle</span>.
        From <span style={{ color: '#22c55e' }}>basics</span> to{' '}
        <span style={{ color: '#ef4444' }}>advanced</span>.
      </>
    ),
    stats: [
      { value: '138', label: 'SQL Queries' },
      { value: '6', label: 'SQL Topics' },
      { value: '4', label: 'DBMS Supported' },
      { value: '100%', label: 'Free' },
    ],
    showTryIt: true,
  },
  java: {
    tag: 'Interactive Java Learning Platform',
    tagColor: '#e76f00',
    title: <>Master Java from<br /><span className="gradient-text">Zero to Hero</span></>,
    desc: (
      <>
        Explore 120+ Java code examples with real-world explanations across{' '}
        <span style={{ color: '#e76f00' }}>Basic</span>,{' '}
        <span style={{ color: '#eab308' }}>Intermediate</span>,{' '}
        <span style={{ color: '#ef4444' }}>Advanced</span>, and{' '}
        <span style={{ color: '#a855f7' }}>Interview</span> prep.
      </>
    ),
    stats: [
      { value: '120+', label: 'Java Examples' },
      { value: '4', label: 'Topics' },
      { value: '6', label: 'Interview Qs' },
      { value: '100%', label: 'Free' },
    ],
    showTryIt: false,
  },
  dotnet: {
    tag: 'Interactive .NET Learning Platform',
    tagColor: '#512bd4',
    title: <>Master .NET from<br /><span className="gradient-text">Zero to Hero</span></>,
    desc: (
      <>
        Explore 120+ C# code examples with real-world explanations across{' '}
        <span style={{ color: '#22c55e' }}>Basic</span>,{' '}
        <span style={{ color: '#eab308' }}>Intermediate</span>,{' '}
        <span style={{ color: '#ef4444' }}>Advanced</span>, and{' '}
        <span style={{ color: '#a855f7' }}>Interview</span> prep.
      </>
    ),
    stats: [
      { value: '120+', label: 'C# Examples' },
      { value: '4', label: 'Topics' },
      { value: '6', label: 'Interview Qs' },
      { value: '100%', label: 'Free' },
    ],
    showTryIt: false,
  },
}

export default function Hero({ onTryIt, language }) {
  const content = HERO_CONTENT[language] || HERO_CONTENT.sql

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-purple-950/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8"
          style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: content.tagColor }}>
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          {content.tag}
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6" style={{ color: 'var(--color-text)' }}>
          {content.title}
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {content.desc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#categories" className="btn-primary">
            Start Learning
          </a>
          {content.showTryIt && (
            <button onClick={onTryIt} className="btn-secondary flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Try It Yourself
            </button>
          )}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {content.stats.map(stat => (
            <div key={stat.label} className="glass-card p-4 animate-glow">
              <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
