import { useState, useRef } from 'react'
import { careerCategories, careerQuestions } from '../careerData'

export default function CareerCounselling() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const answerRef = useRef(null)

  const filteredQuestions = selectedCategory
    ? careerQuestions.filter(q => q.category_id === selectedCategory)
    : []

  const handleQuestionClick = async (q) => {
    if (selectedQuestion?.question === q.question) {
      setSelectedQuestion(null)
      setAnswer('')
      return
    }

    setSelectedQuestion(q)
    setAnswer('')
    setError('')
    setLoading(true)

    const cat = careerCategories.find(c => c.id === selectedCategory)
    const endpoint = '/.netlify/functions/ask-ai'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q.question, category: cat?.name || '' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get answer')
      setAnswer(data.answer)
    } catch (err) {
      setError('Could not load AI answer. Make sure you are on the live site.')
    } finally {
      setLoading(false)
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
    }
  }

  return (
    <section id="career" className="mb-16 scroll-mt-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-4"
          style={{ backgroundColor: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', color: '#14b8a6' }}>
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          AI-Powered Career Guidance
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Career Counselling
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Get personalized AI answers to your career questions after BSc IT
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {careerCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              setSelectedQuestion(null)
              setAnswer('')
              setError('')
            }}
            className="glass-card p-4 text-left card-hover cursor-pointer transition-all duration-200"
            style={selectedCategory === cat.id
              ? { boxShadow: `0 0 0 2px ${cat.color}`, borderColor: cat.color, backgroundColor: 'var(--color-bg-card)' }
              : {}}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{cat.name}</span>
            </div>
            <div className="text-xs" style={{ color: cat.color }}>
              {careerQuestions.filter(q => q.category_id === cat.id).length} questions
            </div>
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="glass-card rounded-2xl p-6">
          {filteredQuestions.length === 0 ? (
            <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>No questions in this category</p>
          ) : (
            <div className="space-y-2">
              {filteredQuestions.map((q, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => handleQuestionClick(q)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 card-hover"
                    style={{
                      backgroundColor: selectedQuestion?.question === q.question ? 'rgba(20,184,166,0.08)' : 'transparent',
                      border: '1px solid',
                      borderColor: selectedQuestion?.question === q.question ? 'rgba(20,184,166,0.3)' : 'transparent',
                    }}
                  >
                    <span className="text-lg shrink-0">{q.question.startsWith('I') || q.question.startsWith('What') || q.question.startsWith('How') || q.question.startsWith('Can') || q.question.startsWith('Should') || q.question.startsWith('Is') || q.question.startsWith('Which') || q.question.startsWith('Will') ? (
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: 'rgba(20,184,166,0.15)', color: '#14b8a6' }}>?</span>
                    ) : (
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: 'rgba(20,184,166,0.15)', color: '#14b8a6' }}>?</span>
                    )}</span>
                    <span className="flex-1 text-sm font-medium" style={{ color: 'var(--color-text)' }}>{q.question}</span>
                    <svg className={`w-4 h-4 shrink-0 transition-transform duration-200 ${selectedQuestion?.question === q.question ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {selectedQuestion?.question === q.question && (
                    <div ref={answerRef} className="mx-4 mb-4 p-5 rounded-xl" style={{ backgroundColor: 'rgba(20,184,166,0.05)', border: '1px solid rgba(20,184,166,0.15)' }}>
                      {loading ? (
                        <div className="flex items-center gap-3 py-4">
                          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#14b8a6', borderTopColor: 'transparent' }} />
                          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>AI is thinking...</span>
                        </div>
                      ) : error ? (
                        <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none" style={{ color: 'var(--color-text-secondary)' }}>
                          {answer.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 leading-relaxed">{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedCategory && (
        <div className="text-center py-12 glass-card rounded-2xl">
          <span className="text-5xl block mb-4">👆</span>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Select a category above to see career questions</p>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>AI will generate personalized answers for each question</p>
        </div>
      )}
    </section>
  )
}
