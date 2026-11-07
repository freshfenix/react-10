import { memo, useMemo, useRef } from 'react'

const categories = ['Дизайн', 'Розробка', 'Аналітика', 'Продукт']
const topics = [
  'React patterns',
  'Інтерфейс користувача',
  'Система компонентів',
  'Оптимізація даних',
  'Дизайн-система',
  'Функціональні компоненти',
  'Веб-аналітика',
  'Продуктова стратегія',
]

const records = Array.from({ length: 12_000 }, (_, index) => ({
  id: index + 1,
  title: `${topics[index % topics.length]} — проєкт ${String(index + 1).padStart(4, '0')}`,
  category: categories[index % categories.length],
}))

function filterRecords(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const startedAt = performance.now()
  const matches = normalizedQuery
    ? records.filter((record) =>
        `${record.title} ${record.category}`.toLocaleLowerCase().includes(normalizedQuery),
      )
    : records

  return {
    items: matches.slice(0, 6),
    total: matches.length,
    duration: performance.now() - startedAt,
  }
}

function RecordList({ items, selectedId, onSelect }) {
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="record-list">
      {items.length > 0 ? items.map((record) => (
        <button
          className={`record-row${selectedId === record.id ? ' is-selected' : ''}`}
          key={record.id}
          type="button"
          onClick={() => onSelect(record.id)}
        >
          <span className="record-number">{String(record.id).padStart(2, '0')}</span>
          <span className="record-title">{record.title}</span>
          <span className="record-category">{record.category}</span>
          <span className="record-arrow" aria-hidden="true">↗</span>
        </button>
      )) : (
        <p className="empty-state">Нічого не знайдено. Спробуйте інший запит.</p>
      )}
      <div className="list-render-note">
        Рендерів списку <strong>{renderCount.current}</strong>
      </div>
    </div>
  )
}

const MemoizedRecordList = memo(RecordList)

function ResultPanel({
  title,
  subtitle,
  variant,
  query,
  selectedId,
  onSelect,
}) {
  const renderCount = useRef(0)
  const calculationCount = useRef(0)
  renderCount.current += 1

  const isMemoized = variant === 'memoized'
  const memoizedResults = useMemo(() => {
    if (!isMemoized) return null
    calculationCount.current += 1
    return filterRecords(query)
  }, [isMemoized, query])
  const regularResults = isMemoized ? null : filterRecords(query)
  if (!isMemoized) calculationCount.current += 1

  const results = isMemoized ? memoizedResults : regularResults

  return (
    <article className={`result-card ${isMemoized ? 'optimized-card' : 'regular-card'}`}>
      <div className="card-heading">
        <div>
          <div className="card-title-row">
            <span className={`approach-icon ${isMemoized ? 'icon-memo' : 'icon-regular'}`}>
              {isMemoized ? '✳' : '↻'}
            </span>
            <h3>{title}</h3>
          </div>
          <p>{subtitle}</p>
        </div>
        <span className={`approach-tag ${isMemoized ? 'tag-memo' : 'tag-regular'}`}>
          {isMemoized ? 'OPTIMIZED' : 'BASELINE'}
        </span>
      </div>

      <div className="metrics">
        <div className="metric">
          <span>ОБЧИСЛЕНЬ</span>
          <strong>{calculationCount.current}</strong>
          <small>{isMemoized ? 'лише при зміні пошуку' : 'після кожного рендера'}</small>
        </div>
        <div className="metric">
          <span>ЧАС ОСТАННЬОГО ПОШУКУ</span>
          <strong>{results.duration.toFixed(2)}<small>мс</small></strong>
          <small>{results.total.toLocaleString('uk-UA')} збігів</small>
        </div>
        <div className="metric">
          <span>РЕНДЕРІВ ПАНЕЛІ</span>
          <strong>{renderCount.current}</strong>
          <small>через оновлення стану</small>
        </div>
      </div>

      {isMemoized ? (
        <MemoizedRecordList
          items={results.items}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ) : (
        <RecordList
          items={results.items}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      )}
    </article>
  )
}

export default function MemoizationDemo({ query, selectedId, onSelect }) {
  return (
    <section className="comparison-grid" aria-label="Порівняння звичайного та оптимізованого підходів">
      <ResultPanel
        title="Без мемоізації"
        subtitle="Фільтрація виконується при кожному рендері."
        variant="regular"
        query={query}
        selectedId={selectedId}
        onSelect={onSelect}
      />
      <ResultPanel
        title="З мемоізацією"
        subtitle="useMemo кешує результат, React.memo — список."
        variant="memoized"
        query={query}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </section>
  )
}
