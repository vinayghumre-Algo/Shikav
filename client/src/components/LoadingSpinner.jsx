export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: 'var(--color-bg-secondary)' }} />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
        </div>
        <p className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>Loading SQL queries...</p>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>Setting up your learning experience</p>
      </div>
    </div>
  )
}
