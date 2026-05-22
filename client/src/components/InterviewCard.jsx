export default function InterviewCard({ query, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-5 text-left card-hover cursor-pointer"
      style={{ borderLeft: '3px solid #a855f7' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl shrink-0 mt-0.5">❓</span>
        <h3 className="text-base font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
          {query.title}
        </h3>
      </div>
      <p className="text-sm mb-3 ml-8 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
        {query.description}
      </p>
      <div className="flex items-center justify-between ml-8">
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ color: '#a855f7', backgroundColor: 'rgba(168,85,247,0.15)' }}>
          interview
        </span>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Click to reveal answer →
        </span>
      </div>
    </button>
  )
}