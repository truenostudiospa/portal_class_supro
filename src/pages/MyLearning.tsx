import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { courses } from '@/data/courses'
import { useStore } from '@/store/useStore'
import { Empty } from '@/components/Empty'
import { useTitle } from '@/hooks/useTitle'

export default function MyLearning() {
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
