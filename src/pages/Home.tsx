import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { categories, courses } from '@/data/courses'
import { simulateNetworkDelay } from '@/lib/utils'
import { GridSkeleton } from '@/components/Skeleton'
import { CourseCard } from '@/components/CourseCard'
import { useTitle } from '@/hooks/useTitle'

export default function Home() {
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
