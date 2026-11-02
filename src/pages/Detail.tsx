import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CheckCircle2, Play, Star, Users } from 'lucide-react'
import { toast } from 'sonner'
import { courses, reviews } from '@/data/courses'
import { cn, formatPrice } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { useTitle } from '@/hooks/useTitle'

export default function Detail() {
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
