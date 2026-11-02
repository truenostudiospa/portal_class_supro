import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronDown, Filter, Search } from 'lucide-react'
import { categories, courses } from '@/data/courses'
import { cn, simulateNetworkDelay } from '@/lib/utils'
import { GridSkeleton } from '@/components/Skeleton'
import { CourseCard } from '@/components/CourseCard'
import { Empty } from '@/components/Empty'
import { useTitle } from '@/hooks/useTitle'

export default function Catalog() {
  useTitle('Explorar cursos')
  const loc = useLocation()
  const params = new URLSearchParams(loc.search)
  const [q, setQ] = useState(params.get('q') || '')
  const [sport, setSport] = useState(params.get('sport') || '')
  const [level, setLevel] = useState('')
  const [range, setRange] = useState('')
  const [order, setOrder] = useState('popular')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const activeFilters = [q, sport, level, range].filter(Boolean).length
  useEffect(() => {
    setLoading(true)
    simulateNetworkDelay().then(() => setLoading(false))
  }, [q, sport, level, range, order])
  let list = courses.filter(
    (c) =>
      (!q || `${c.title} ${c.sport} ${c.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())) &&
      (!sport || c.sport === sport) &&
      (!level || c.level === level) &&
      (!range ||
        (range === 'under35'
          ? c.price < 35
          : range === '35to45'
            ? c.price >= 35 && c.price <= 45
            : c.price > 45)),
  )
  list = [...list].sort((a, b) =>
    order === 'rating'
      ? b.rating - a.rating
      : order === 'low'
        ? a.price - b.price
        : order === 'high'
          ? b.price - a.price
          : b.students - a.students,
  )
  const clear = () => {
    setQ('')
    setSport('')
    setLevel('')
    setRange('')
  }
  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-2xl font-black sm:text-3xl">Explora cursos</h1>
      <p className="mt-2 text-slate-500">
        Entrena con contenido hecho por quienes viven el deporte.
      </p>
      <button
        onClick={() => setShowFilters(!showFilters)}
        aria-expanded={showFilters}
        className="btn-secondary mt-6 w-full justify-between lg:hidden"
      >
        <span className="flex items-center gap-2">
          <Filter size={18} />
          Filtros{activeFilters > 0 && ` (${activeFilters})`}
        </span>
        <ChevronDown size={18} className={cn('transition', showFilters && 'rotate-180')} />
      </button>
      <div className="mt-4 grid gap-7 lg:mt-8 lg:grid-cols-[250px_1fr]">
        <aside
          className={cn(
            'h-fit rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24 lg:block dark:border-slate-800 dark:bg-slate-900',
            !showFilters && 'hidden',
          )}
        >
          <div className="mb-4 hidden items-center gap-2 font-bold lg:flex">
            <Filter size={18} />
            Filtros
          </div>
          <label className="block text-sm font-semibold">
            Buscar
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5 text-base sm:text-sm dark:bg-slate-950"
              placeholder="Ej. running"
            />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Deporte
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5 text-base sm:text-sm dark:bg-slate-950"
            >
              <option value="">Todos</option>
              {categories.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Nivel
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5 text-base sm:text-sm dark:bg-slate-950"
            >
              <option value="">Todos</option>
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Rango de precio
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2.5 text-base sm:text-sm dark:bg-slate-950"
            >
              <option value="">Todos</option>
              <option value="under35">Menos de US$35</option>
              <option value="35to45">US$35 a US$45</option>
              <option value="over45">Más de US$45</option>
            </select>
          </label>
          <button className="mt-5 py-1 text-sm font-bold text-orange-600" onClick={clear}>
            Limpiar filtros
          </button>
        </aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">{list.length} cursos encontrados</p>
            <label className="flex items-center gap-2 text-sm font-semibold">
              Ordenar
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="rounded-lg border p-2 dark:bg-slate-900"
              >
                <option value="popular">Más vendidos</option>
                <option value="rating">Mejor valorados</option>
                <option value="low">Precio: menor</option>
                <option value="high">Precio: mayor</option>
              </select>
            </label>
          </div>
          {loading ? (
            <GridSkeleton />
          ) : list.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {list.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <Empty
              icon={<Search size={40} />}
              title="No encontramos cursos"
              text="Prueba con otra búsqueda o elimina algunos filtros."
              action="Limpiar filtros"
              onAction={clear}
            />
          )}
        </div>
      </div>
    </div>
  )
}
