export function Empty({
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
