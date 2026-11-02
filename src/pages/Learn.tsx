import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Play, ArrowLeft, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { courses } from '@/data/courses'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { useTitle } from '@/hooks/useTitle'

const EMPTY: string[] = []

export default function Learn() {
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
