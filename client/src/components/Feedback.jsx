import { useState, useEffect } from 'react'

function VisitorCounter() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    const counted = sessionStorage.getItem('visitor_counted')
    if (counted) {
      fetch('https://api.countapi.xyz/get/shikav-tech/visitors')
        .then(r => r.json())
        .then(d => setCount(d.value))
        .catch(() => {})
      return
    }
    fetch('https://api.countapi.xyz/hit/shikav-tech/visitors')
      .then(r => r.json())
      .then(d => { setCount(d.value); sessionStorage.setItem('visitor_counted', '1') })
      .catch(() => {})
  }, [])

  if (count === null) return null

  return (
    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>{count.toLocaleString()} visitors</span>
    </div>
  )
}

export default function Feedback() {
  const [formState, setFormState] = useState('idle')
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState('submitting')
    setFormError('')

    const form = e.target
    const data = new URLSearchParams()
    for (const field of form.elements) {
      if (field.name) data.append(field.name, field.value)
    }

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      })
      if (res.ok) {
        setFormState('success')
        form.reset()
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      setFormError('Could not submit. Please try again or email us directly.')
      setFormState('idle')
    }
  }

  return (
    <section id="feedback" className="mb-16 scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
          Feedback & Suggestions
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
          Help us improve Shikav with your valuable feedback
        </p>
      </div>

      <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <VisitorCounter />
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400" />
            powered by Netlify Forms
          </div>
        </div>

        {formState === 'success' ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Thank you for your feedback!</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>We appreciate your input.</p>
            <button onClick={() => setFormState('idle')} className="btn-secondary text-sm mt-4">
              Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-netlify="true" name="feedback" className="space-y-4">
            <input type="hidden" name="form-name" value="feedback" />

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                className="input-field px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="input-field px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Message <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Your comment, suggestion, or feedback..."
                className="input-field px-4 py-2.5 text-sm resize-none"
              />
            </div>

            {formError && (
              <p className="text-sm" style={{ color: '#ef4444' }}>{formError}</p>
            )}

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="btn-primary w-full text-sm flex items-center justify-center gap-2"
            >
              {formState === 'submitting' ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Sending...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> Send Feedback</>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
