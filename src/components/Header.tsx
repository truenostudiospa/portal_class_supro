import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CircleUserRound, Menu, Moon, Search, ShoppingCart, Sun, X, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string }>
}

export function Header() {
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
