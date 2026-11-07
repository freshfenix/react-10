import { useCallback, useState } from 'react'
import MemoizationDemo from './components/MemoizationDemo.jsx'

export default function App() {
  const [query, setQuery] = useState('')
  const [unrelatedCount, setUnrelatedCount] = useState(0)
  const [selectedId, setSelectedId] = useState(null)

  const handleUnrelatedUpdate = useCallback(() => {
    setUnrelatedCount((count) => count + 1)
  }, [])

  const handleSelect = useCallback((id) => {
    setSelectedId((currentId) => (currentId === id ? null : id))
  }, [])

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> REACT PERFORMANCE LAB</div>
          <h1>Менше зайвої роботи.<br /><span>Більше швидкості.</span></h1>
          <p>
            Подивіться, як мемоізація допомагає уникати повторних обчислень і
            рендерів у React.
          </p>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <span>use</span>
          <strong>memo</strong>
          <i>↗</i>
        </div>
      </header>

      <section className="control-panel" aria-label="Керування демонстрацією">
        <label className="search-control">
          <span className="control-label">ПОШУК ПО 12 000 ЗАПИСАХ</span>
          <span className="input-wrap">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Спробуйте: React, дизайн, аналітика..."
            />
            <kbd>⌘ K</kbd>
          </span>
        </label>
        <div className="counter-control">
          <div>
            <span className="control-label">НЕЗАЛЕЖНЕ ОНОВЛЕННЯ</span>
            <strong className="counter-value">{String(unrelatedCount).padStart(2, '0')}</strong>
          </div>
          <button className="update-button" type="button" onClick={handleUnrelatedUpdate}>
            Оновити стан <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <span className="control-label">ПОРІВНЯННЯ В РЕАЛЬНОМУ ЧАСІ</span>
          <h2>Одна задача. Два підходи.</h2>
        </div>
        <span className="dataset-badge"><span /> 12 000 записів</span>
      </div>

      <MemoizationDemo
        query={query}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <footer className="page-footer">
        <span>Інтерактивний приклад мемоізації в React</span>
        <span>Змініть пошук або натисніть «Оновити стан»</span>
      </footer>
    </main>
  )
}
