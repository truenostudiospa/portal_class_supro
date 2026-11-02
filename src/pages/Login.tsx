import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useStore } from '@/store/useStore'
import { useTitle } from '@/hooks/useTitle'

const schema = z.object({
  email: z.string().email('Escribe un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export default function Login() {
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
