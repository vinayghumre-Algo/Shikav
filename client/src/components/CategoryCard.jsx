export default function CategoryCard({ category, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-6 text-left card-hover cursor-pointer"
      style={isActive ? { boxShadow: '0 0 0 2px rgba(99,102,241,0.5)', backgroundColor: 'var(--color-bg-card)' } : {}}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${category.color}15` }}>
          {category.icon}
        </div>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{category.name}</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>{category.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Includes practice questions &amp; multi-DBMS examples</span>
        <div className="flex gap-1">
          {Array.from({ length: category.level }, (_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
          ))}
        </div>
      </div>
    </button>
  )
}
