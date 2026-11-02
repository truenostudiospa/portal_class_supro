import { ShoppingCart, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { courses } from '@/data/courses'
import { formatPrice } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { Empty } from '@/components/Empty'
import { useTitle } from '@/hooks/useTitle'

export default function Cart() {
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
