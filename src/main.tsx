import { lazy, Suspense, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Filter,
  Menu,
  Moon,
  Play,
  Search,
  ShoppingCart,
  Star,
  Sun,
  X,
  Download,
  Trash2,
  ArrowLeft,
  Clock,
  Users,
  WifiOff,
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { categories, courses, reviews } from '@/data/courses'
import { cn, formatPrice, simulateNetworkDelay } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import type { Course } from '@/types'
import './index.css'

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton', className)} />
)
function CourseCard({ course }: { course: Course }) {
  const add = useStore((s) => s.addToCart),
    cart = useStore((s) => s.cart)
  return (
    <article className="card group">
      <Link to={`/course/${course.slug}`}>
        <img
          className="aspect-video w-full object-cover"
          src={course.thumbnail}
          alt={`Portada del curso ${course.title}`}
          loading="lazy"
        />
        <div className="p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-orange-600">
            {course.sport} · {course.level}
          </p>
          <h3 className="line-clamp-2 min-h-12 font-bold leading-6">{course.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{course.instructor.name}</p>
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="font-bold text-amber-600">{course.rating}</span>
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="text-slate-500">({course.reviewsCount})</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        <strong>{formatPrice(course.price)}</strong>
        <button
          onClick={() => {
            add(course.id)
            toast.success(
              cart.includes(course.id)
                ? 'El curso ya está en tu carrito'
                : 'Curso agregado al carrito',
            )
          }}
          className="rounded-md p-2 text-orange-600 hover:bg-orange-50"
          aria-label={`Agregar ${course.title} al carrito`}
        >
          <ShoppingCart size={19} />
        </button>
      </div>
    </article>
  )
}
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="card">
          <Skeleton className="aspect-video" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
function Header() {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(''),
    [install, setInstall] = useState<BeforeInstallPromptEvent | null>(null)
  const cart = useStore((s) => s.cart)
  const user = useStore((s) => s.user)
  const nav = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault()
      setInstall(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) nav(`/courses?q=${encodeURIComponent(query)}`)
  }
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="container-page flex h-16 items-center gap-1 sm:gap-3">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-lg font-black text-slate-900 dark:text-white"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 text-white">
            SA
          </span>
          <span className="hidden sm:block">SportAcademy</span>
        </Link>
        <form onSubmit={submit} className="hidden max-w-xl flex-1 md:block">
          <label className="relative block">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900"
              placeholder="Busca cursos, deportes o habilidades"
              aria-label="Buscar cursos"
            />
          </label>
        </form>
        <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold lg:flex">
          <NavLink to="/courses">Explorar</NavLink>
          <NavLink to="/my-learning">Mi aprendizaje</NavLink>
        </nav>
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="ml-auto rounded-lg p-2.5 hover:bg-slate-100 md:ml-0 lg:ml-0 dark:hover:bg-slate-800"
          aria-label="Cambiar tema"
        >
          <Sun className="dark:hidden" size={19} />
          <Moon className="hidden dark:block" size={19} />
        </button>
        {install && (
          <button
            onClick={async () => {
              await install.prompt()
              setInstall(null)
            }}
            className="hidden rounded-lg bg-orange-100 p-2.5 text-orange-700 sm:block"
            aria-label="Instalar aplicación"
          >
            <Download size={19} />
          </button>
        )}
        <Link
          to="/cart"
          className="relative rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Carrito"
        >
          <ShoppingCart size={20} />
          {cart.length > 0 && (
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-orange-500 px-1 text-[10px] text-white">
              {cart.length}
            </span>
          )}
        </Link>
        <Link
          to={user ? '/my-learning' : '/login'}
          className="rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Perfil"
        >
          <CircleUserRound size={21} />
        </Link>
        <button
          className="rounded-lg p-2.5 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="container-page border-t border-slate-200 py-4 lg:hidden dark:border-slate-800">
          <form onSubmit={submit} className="mb-3 md:hidden">
            <label className="relative block">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-10 pr-3 text-base dark:border-slate-700 dark:bg-slate-900"
                placeholder="Buscar cursos"
                aria-label="Buscar cursos"
              />
            </label>
          </form>
          <nav className="flex flex-col font-semibold">
            {[
              ['/courses', 'Explorar'],
              ['/my-learning', 'Mi aprendizaje'],
              ['/cart', 'Carrito'],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-3 hover:bg-slate-100 dark:hover:bg-slate-800',
                    isActive && 'text-orange-600',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
function Footer() {
  return (
    <footer className="mt-12 bg-slate-950 py-10 text-slate-300 sm:mt-16">
      <div className="container-page flex flex-col justify-between gap-6 sm:flex-row">
        <div>
          <b className="text-lg text-white">SportAcademy</b>
          <p className="mt-2 text-sm">Aprende, entrena y alcanza tu mejor versión.</p>
        </div>
        <p className="text-sm">© 2026 SportAcademy · Educación deportiva para todos.</p>
      </div>
    </footer>
  )
}
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · SportAcademy`
  }, [title])
}
function Home() {
  useTitle('Cursos deportivos')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    simulateNetworkDelay().then(() => setLoading(false))
  }, [])
  return (
    <>
      <section className="bg-slate-950 py-10 text-white sm:py-16 lg:py-20">
        <div className="container-page grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          <div>
            <p className="mb-4 font-semibold text-orange-400">ENTRENA CON PROPÓSITO</p>
            <h1 className="max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Tu próximo nivel empieza aquí.
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg">
              Cursos impartidos por profesionales para que entrenes mejor, disfrutes más y llegues
              más lejos.
            </p>
            <Link to="/courses" className="btn-primary mt-7 w-full sm:w-auto">
              Explorar cursos <Play size={17} />
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-2xl">
            <img
              className="aspect-[16/10] w-full object-cover opacity-85"
              src="https://picsum.photos/seed/sporthero/900/600"
              alt="Atleta entrenando"
            />
            <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 p-2 text-slate-900 shadow sm:bottom-4 sm:left-4 sm:p-3">
              <b>+38.000</b>
              <span className="ml-1 text-sm">alumnos activos</span>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-10 sm:py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-orange-600">EXPLORA POR DISCIPLINA</p>
            <h2 className="text-xl font-bold sm:text-2xl">Encuentra tu deporte</h2>
          </div>
          <Link to="/courses" className="shrink-0 py-2 text-sm font-bold text-orange-600">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/courses?sport=${c.name}`}
              className="rounded-xl border border-slate-200 bg-white p-3 text-center transition hover:-translate-y-1 hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-2xl">{c.icon}</span>
              <p className="mt-1 truncate text-xs font-bold">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="container-page">
        <div className="mb-6">
          <p className="font-semibold text-orange-600">DESTACADOS</p>
          <h2 className="text-xl font-bold sm:text-2xl">
            Los cursos que mueven a nuestra comunidad
          </h2>
        </div>
        {loading ? (
          <GridSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.slice(0, 8).map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
function Catalog() {
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
function Detail() {
  const { slug } = useParams()
  const course = courses.find((c) => c.slug === slug)
  const [tab, setTab] = useState('Descripción')
  const add = useStore((s) => s.addToCart)
  if (!course) return <Navigate to="/courses" />
  useTitle(course.title)
  return (
    <>
      <section className="bg-slate-950 py-8 text-white sm:py-10">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_370px]">
          <div>
            <p className="font-bold text-orange-400">
              {course.sport} · {course.level}
            </p>
            <h1 className="mt-3 text-2xl font-black sm:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">{course.subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                {course.rating} ({course.reviewsCount} reseñas)
              </span>
              <span className="flex items-center gap-1">
                <Users size={16} />
                {course.students.toLocaleString()} estudiantes
              </span>
              <span>Actualizado {course.updatedAt}</span>
            </div>
          </div>
          <div className="card mx-auto w-full max-w-md overflow-hidden text-slate-900 lg:max-w-none dark:text-white">
            <img
              src={course.thumbnail}
              alt="Vista previa del curso"
              className="aspect-video w-full object-cover"
            />
            <div className="p-5">
              <b className="text-2xl">{formatPrice(course.price)}</b>
              <button
                onClick={() => {
                  add(course.id)
                  toast.success('Curso agregado al carrito')
                }}
                className="btn-primary mt-4 w-full"
              >
                Agregar al carrito
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">
                Garantía de satisfacción de 30 días
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-8 sm:py-10">
        <div className="max-w-4xl">
          <div className="-mx-4 mb-7 flex gap-1 overflow-x-auto border-b px-4 sm:mx-0 sm:px-0 dark:border-slate-800">
            {['Descripción', 'Temario', 'Instructor', 'Reseñas'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'shrink-0 border-b-2 px-3 py-3 text-sm font-bold sm:px-4 sm:text-base',
                  tab === t
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500',
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === 'Descripción' && (
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Acerca de este curso</h2>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                {course.description}
              </p>
              <h3 className="mt-7 text-xl font-bold">Lo que aprenderás</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  'Construir una base técnica sólida',
                  'Entrenar con un plan progresivo',
                  'Reconocer y corregir errores comunes',
                  'Medir tus avances con confianza',
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <CheckCircle2 className="shrink-0 text-orange-500" size={19} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === 'Temario' && (
            <div className="card">
              {course.lessons.map((l, i) => (
                <div
                  key={l.id}
                  className="flex items-start gap-3 border-b p-4 last:border-0 sm:items-center dark:border-slate-800"
                >
                  <Play size={18} className="mt-0.5 shrink-0 text-orange-500 sm:mt-0" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <span className="flex-1 font-medium">
                      {i + 1}. {l.title}
                    </span>
                    {l.isFree && (
                      <span className="text-xs font-bold text-orange-600">VISTA PREVIA</span>
                    )}
                  </div>
                  <span className="shrink-0 text-sm text-slate-500">{l.duration}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'Instructor' && (
            <div className="card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                <img
                  src={course.instructor.avatar}
                  className="h-20 w-20 shrink-0 rounded-full"
                  alt={course.instructor.name}
                />
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">{course.instructor.name}</h2>
                  <p className="text-orange-600">Instructor de SportAcademy</p>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{course.instructor.bio}</p>
                  <p className="mt-3 text-sm">
                    ⭐ {course.instructor.rating} · {course.instructor.students.toLocaleString()}{' '}
                    estudiantes · {course.instructor.coursesCount} cursos
                  </p>
                </div>
              </div>
            </div>
          )}
          {tab === 'Reseñas' && (
            <div className="space-y-4">
              {reviews.map((r) => (
                <article key={r.id} className="card p-4 sm:p-5">
                  <div className="flex gap-3">
                    <img className="h-10 w-10 shrink-0 rounded-full" src={r.avatar} alt={r.user} />
                    <div className="min-w-0">
                      <b>{r.user}</b>
                      <p className="text-sm text-amber-600">
                        {'★'.repeat(r.rating)} <span className="ml-2 text-slate-400">{r.date}</span>
                      </p>
                      <p className="mt-2 text-slate-600 dark:text-slate-300">{r.comment}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
function Empty({
  icon,
  title,
  text,
  action,
  onAction,
}: {
  icon: React.ReactNode
  title: string
  text: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="card grid min-h-72 place-items-center p-6 text-center sm:p-8">
      <div className="text-orange-500">{icon}</div>
      <div>
        <h2 className="mt-4 text-xl font-bold">{title}</h2>
        <p className="mt-2 max-w-sm text-slate-500">{text}</p>
        {action && (
          <button onClick={onAction} className="btn-primary mt-5">
            {action}
          </button>
        )}
      </div>
    </div>
  )
}
function Cart() {
  useTitle('Carrito')
  const cart = useStore((s) => s.cart),
    remove = useStore((s) => s.removeFromCart),
    enroll = useStore((s) => s.enroll)
  const list = courses.filter((c) => cart.includes(c.id))
  const total = list.reduce((x, c) => x + c.price, 0)
  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-2xl font-black sm:text-3xl">Tu carrito</h1>
      {!list.length ? (
        <div className="mt-7">
          <Empty
            icon={<ShoppingCart size={44} />}
            title="Tu carrito está esperando"
            text="Explora cursos y guarda los que te ayudarán a alcanzar tu próximo objetivo."
            action="Explorar cursos"
            onAction={() => location.assign('/courses')}
          />
        </div>
      ) : (
        <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_330px]">
          <div className="space-y-4">
            {list.map((c) => (
              <article key={c.id} className="card flex gap-3 p-3 sm:gap-4 sm:p-4">
                <img
                  src={c.thumbnail}
                  alt=""
                  className="aspect-video w-24 shrink-0 self-start rounded-lg object-cover sm:w-36"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                    <h2 className="line-clamp-2 font-bold">{c.title}</h2>
                    <b className="shrink-0">{formatPrice(c.price)}</b>
                  </div>
                  <p className="text-sm text-slate-500">
                    {c.instructor.name} · {c.sport}
                  </p>
                  <button
                    onClick={() => remove(c.id)}
                    className="-ml-1 mt-2 flex items-center gap-1 rounded-md p-1 text-sm font-bold text-red-600 sm:mt-3"
                  >
                    <Trash2 size={15} />
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="card h-fit p-5 lg:sticky lg:top-24">
            <p className="text-sm text-slate-500">Total:</p>
            <strong className="text-3xl">{formatPrice(total)}</strong>
            <button
              onClick={() => {
                enroll(cart)
                toast.success('¡Inscripción simulada completada!')
              }}
              className="btn-primary mt-5 w-full"
            >
              Finalizar compra
            </button>
            <p className="mt-3 text-center text-xs text-slate-500">
              Pago simulado · Sin cargos reales
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
function MyLearning() {
  useTitle('Mi aprendizaje')
  const enrolled = useStore((s) => s.enrolled),
    completed = useStore((s) => s.completed)
  const list = courses.filter((c) => enrolled.includes(c.id))
  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-2xl font-black sm:text-3xl">Mi aprendizaje</h1>
      <p className="mt-2 text-slate-500">Sigue avanzando hacia tu objetivo.</p>
      {!list.length ? (
        <div className="mt-7">
          <Empty
            icon={<BookOpen size={44} />}
            title="Aún no tienes cursos"
            text="Cuando te inscribas a un curso, aparecerá aquí para que puedas continuar aprendiendo."
            action="Explorar cursos"
            onAction={() => location.assign('/courses')}
          />
        </div>
      ) : (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const pct = Math.round(((completed[c.id]?.length || 0) / c.lessons.length) * 100)
            return (
              <article className="card" key={c.id}>
                <img className="aspect-video w-full object-cover" src={c.thumbnail} alt="" />
                <div className="p-4">
                  <h2 className="line-clamp-2 font-bold">{c.title}</h2>
                  <div className="mt-4 h-2 overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
                    <div className="h-full bg-orange-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{pct}% completado</p>
                  <Link
                    className="btn-primary mt-4 w-full"
                    to={`/learn/${c.id}/${c.lessons[0].id}`}
                  >
                    Continuar
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
const schema = z.object({
  email: z.string().email('Escribe un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
function Login() {
  useTitle('Iniciar sesión')
  const login = useStore((s) => s.login)
  const nav = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-8 sm:py-10">
      <form
        onSubmit={handleSubmit((v) => {
          login(v.email)
          toast.success('Sesión iniciada (modo demo)')
          nav('/my-learning')
        })}
        className="card w-full max-w-md p-5 sm:p-7"
      >
        <h1 className="text-2xl font-black">Bienvenido de vuelta</h1>
        <p className="mt-2 text-slate-500">Inicia sesión para seguir entrenando.</p>
        <label className="mt-6 block text-sm font-bold">
          Email
          <input
            {...register('email')}
            className="mt-1 w-full rounded-lg border p-3 text-base dark:bg-slate-950"
            type="email"
            placeholder="tu@email.com"
          />
          <span className="text-xs text-red-600">{errors.email?.message}</span>
        </label>
        <label className="mt-4 block text-sm font-bold">
          Contraseña
          <input
            {...register('password')}
            className="mt-1 w-full rounded-lg border p-3 text-base dark:bg-slate-950"
            type="password"
            placeholder="••••••••"
          />
          <span className="text-xs text-red-600">{errors.password?.message}</span>
        </label>
        <button className="btn-primary mt-6 w-full">Iniciar sesión</button>
        <p className="mt-3 text-center text-xs text-slate-500">
          Demo: cualquier email y contraseña de 6+ caracteres.
        </p>
      </form>
    </div>
  )
}
const EMPTY: string[] = []
function Learn() {
  const { courseId, lessonId } = useParams()
  const course = courses.find((c) => c.id === courseId)
  const nav = useNavigate()
  const done = useStore((s) => s.completed[courseId || '']) ?? EMPTY,
    toggle = useStore((s) => s.toggleLesson)
  if (!course) return <Navigate to="/my-learning" />
  const lesson = course.lessons.find((l) => l.id === lessonId) || course.lessons[0]
  useTitle(`${course.title} · Lección`)
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-slate-800 bg-slate-950/95 px-2 backdrop-blur sm:h-16 sm:gap-4 sm:px-4">
        <button
          onClick={() => nav('/my-learning')}
          aria-label="Volver"
          className="shrink-0 rounded-lg p-2.5 hover:bg-slate-800"
        >
          <ArrowLeft />
        </button>
        <b className="line-clamp-1 min-w-0 text-sm sm:text-base">{course.title}</b>
      </header>
      <div className="grid lg:grid-cols-[1fr_330px]">
        <main className="min-w-0 p-0 sm:p-7">
          <video
            className="aspect-video w-full bg-black sm:rounded-xl"
            controls
            poster={course.thumbnail}
            src={lesson.videoUrl}
          >
            Tu navegador no soporta vídeo.
          </video>
          <div className="p-4 sm:p-0">
            <h1 className="text-xl font-bold sm:mt-6 sm:text-2xl">{lesson.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  toggle(course.id, lesson.id)
                  toast.success(
                    done.includes(lesson.id)
                      ? 'Lección marcada como pendiente'
                      : '¡Lección completada!',
                  )
                }}
                className="btn-primary w-full sm:w-auto"
              >
                {done.includes(lesson.id) ? 'Marcar pendiente' : 'Completar lección'}
              </button>
              <span className="flex items-center gap-1 self-center text-slate-400">
                <Clock size={16} />
                {lesson.duration}
              </span>
            </div>
          </div>
        </main>
        <aside className="border-t border-slate-800 bg-slate-900 p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-l lg:border-t-0">
          <h2 className="mb-4 font-bold">Contenido del curso</h2>
          {course.lessons.map((l, i) => (
            <Link
              key={l.id}
              to={`/learn/${course.id}/${l.id}`}
              className={cn(
                'mb-2 flex items-center gap-3 rounded-lg p-3 text-sm',
                l.id === lesson.id ? 'bg-orange-500 text-white' : 'hover:bg-slate-800',
              )}
            >
              <span>{done.includes(l.id) ? <CheckCircle2 size={17} /> : <Play size={17} />}</span>
              <span className="min-w-0 flex-1">
                {i + 1}. {l.title}
              </span>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  )
}
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string }>
}
function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="container-page py-10">
            <GridSkeleton />
          </div>
        }
      >
        <Routes>
          <Route path="/learn/:courseId/:lessonId" element={<Learn />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Catalog />} />
                  <Route path="/course/:slug" element={<Detail />} />
                  <Route path="/my-learning" element={<MyLearning />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}
createRoot(document.getElementById('root')!).render(<App />)
