import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import type { Course } from '@/types'

export function CourseCard({ course }: { course: Course }) {
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
