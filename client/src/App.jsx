import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import CategoryCard from './components/CategoryCard'
import QueryCard from './components/QueryCard'
import InterviewCard from './components/InterviewCard'
import Footer from './components/Footer'
import SqlPlayground from './components/SqlPlayground'
import CareerCounselling from './components/CareerCounselling'
import Feedback from './components/Feedback'
import { categories as sqlCategories, queries as sqlQueries } from './data'
import { javaCategories, javaQueries } from './javaData'
import { dotnetCategories, dotnetQueries } from './dotnetData'

const DBMS_LABELS = { sqlite: 'SQLite', mysql: 'MySQL', postgres: 'PostgreSQL', oracle: 'Oracle' }

const LANG_CONFIG = {
  sql: { label: 'SQL', icon: '🗄️', title: 'Explore SQL Topics', desc: 'Master SQL from fundamentals to advanced concepts with hands-on examples', categories: sqlCategories, queries: sqlQueries, color: '#22c55e' },
  java: { label: 'Java', icon: '☕', title: 'Explore Java Topics', desc: 'Master Java from fundamentals to advanced concepts with practical code examples', categories: javaCategories, queries: javaQueries, color: '#e76f00' },
  dotnet: { label: '.NET', icon: '🔷', title: 'Explore .NET Topics', desc: 'Master .NET & C# from fundamentals to advanced concepts with practical examples', categories: dotnetCategories, queries: dotnetQueries, color: '#512bd4' },
}

export default function App() {
  const [language, setLanguage] = useState('sql')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDbms, setSelectedDbms] = useState('sqlite')
  const [showPlayground, setShowPlayground] = useState(false)

  const config = LANG_CONFIG[language]
  const isSql = language === 'sql'

  const filteredQueries = config.queries.filter(q => {
    const mc = !selectedCategory || q.category_id === selectedCategory
    const ms = !searchTerm ||
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.sql_code || '').toLowerCase().includes(searchTerm.toLowerCase())
    return mc && ms
  })

  const switchLang = (lang) => {
    setLanguage(lang)
    setSelectedCategory(null)
    setSelectedQuery(null)
    setSearchTerm('')
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDbms={selectedDbms}
        onDbmsChange={setSelectedDbms}
        language={language}
        onLanguageChange={switchLang}
        showDbms={isSql}
      />

      <Hero onTryIt={() => setShowPlayground(true)} language={language} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section id="categories" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              {config.title}
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              {config.desc}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.categories.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isActive={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              />
            ))}
          </div>
        </section>

        <section id="queries">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                {selectedCategory
                  ? config.categories.find(c => c.id === selectedCategory)?.name || 'Queries'
                  : 'All Queries'}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)' }} className="mt-1 text-sm">
                {filteredQueries.length} {filteredQueries.length === 1 ? 'item' : 'items'} found
                {isSql && selectedDbms !== 'sqlite' && ` · showing ${DBMS_LABELS[selectedDbms]} syntax`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)} className="btn-secondary text-sm">
                  Clear filter
                </button>
              )}
              {isSql && (
                <button onClick={() => setShowPlayground(true)} className="btn-primary text-sm">
                  Try It Yourself
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredQueries.map(q => (
              q.difficulty === 'interview' ? (
                <InterviewCard
                  key={q.title}
                  query={q}
                  onClick={() => setSelectedQuery(selectedQuery?.title === q.title ? null : q)}
                />
              ) : (
                <QueryCard
                  key={q.title}
                  query={q}
                  selectedDbms={selectedDbms}
                  isSelected={selectedQuery?.title === q.title}
                  onClick={() => setSelectedQuery(selectedQuery?.title === q.title ? null : q)}
                  language={language}
                />
              )
            ))}
          </div>

          {filteredQueries.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>No items found matching your criteria</p>
            </div>
          )}
        </section>

        {language === 'sql' && <CareerCounselling />}

        <Feedback />

        {selectedQuery && (
          <QueryDetailModal
            query={selectedQuery}
            selectedDbms={selectedDbms}
            onClose={() => setSelectedQuery(null)}
            onOpenPlayground={() => setShowPlayground(true)}
            language={language}
          />
        )}
      </main>

      {showPlayground && (
        <SqlPlayground
          selectedDbms={selectedDbms}
          onClose={() => setShowPlayground(false)}
        />
      )}

      <Footer />
    </div>
  )
}

function QueryDetailModal({ query, selectedDbms, onClose, onOpenPlayground, language }) {
  const [copied, setCopied] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const isInterview = query.difficulty === 'interview'
  const isSql = language === 'sql'
  const codeLabel = isSql ? 'SQL Query' : 'Code Example'

  const getCode = () => {
    if (!isSql) return query.sql_code
    const map = { sqlite: query.sql_code, mysql: query.mysql_code, postgres: query.postgres_code, oracle: query.oracle_code }
    return map[selectedDbms] || query.sql_code
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const getCodeStyle = () => {
    if (!isSql) return { borderColor: '#6366f140' }
    const styles = {
      sqlite: { borderColor: '#22c55e40' },
      mysql: { borderColor: '#f59e0b40' },
      postgres: { borderColor: '#3b82f640' },
      oracle: { borderColor: '#ef444440' },
    }
    return styles[selectedDbms] || styles.sqlite
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: 'var(--color-bg-card)', backdropFilter: 'blur(24px)', border: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full text-white" style={{ backgroundColor: query.category_color || '#6366f1' }}>
                {query.category_name}
              </span>
              {isInterview && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>
                  interview
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {isInterview ? '❓ ' : ''}{query.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors shrink-0" style={{ color: 'var(--color-text-muted)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p style={{ color: 'var(--color-text-secondary)' }} className="mb-6">{query.description}</p>

        {isInterview ? (
          <>
            <div className="mb-6 rounded-xl p-5" style={{ backgroundColor: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#a855f7' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Answer
              </h4>
              <p style={{ color: 'var(--color-text-secondary)' }} className="leading-relaxed">{query.explanation}</p>
            </div>
            {query.sql_code ? (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Code Example</span>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                    style={{ color: copied ? '#22c55e' : 'var(--color-text-muted)' }}>
                    {copied ? (
                      <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
                    )}
                  </button>
                </div>
                <div className="code-block" style={{ borderColor: '#a855f740' }}>
                  <pre className="font-mono text-sm whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>{getCode()}</pre>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>{codeLabel}</span>
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                  style={{ color: copied ? '#22c55e' : 'var(--color-text-muted)' }}>
                  {copied ? (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
                  )}
                </button>
              </div>
              <div className="code-block" style={getCodeStyle()}>
                <pre className="font-mono text-sm whitespace-pre-wrap" style={{ color: 'var(--color-text)' }}>{getCode()}</pre>
              </div>
            </div>

            {query.explanation && (
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Explanation</h4>
                <p style={{ color: 'var(--color-text-secondary)' }} className="leading-relaxed">{query.explanation}</p>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Example Output</h4>
              <div className="code-block" style={{ backgroundColor: 'var(--color-bg)' }}>
                <pre className="font-mono text-sm whitespace-pre-wrap" style={{ color: '#34d399' }}>{query.result_example}</pre>
              </div>
            </div>

            {query.question && (
              <div className="mb-6 rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <span className="text-lg">📝</span>
                  <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Practice Question</span>
                  <svg className={`w-4 h-4 ml-auto transition-transform ${showAnswer ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showAnswer && (
                  <div className="mt-3">
                    <p style={{ color: 'var(--color-text-secondary)' }} className="text-sm mb-3">{query.question}</p>
                    <div className="code-block" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                      <pre className="font-mono text-sm" style={{ color: '#fbbf24' }}>{query.question_answer}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {isSql && (
          <div className="flex justify-center pt-2">
            <button onClick={onOpenPlayground} className="btn-primary text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try It Yourself
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
