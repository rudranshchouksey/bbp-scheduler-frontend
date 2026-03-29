import clsx from 'clsx'
import type { UnitOpStatus } from '../../types'

const STATUS_STYLES: Record<UnitOpStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export const Badge = ({ status }: { status: UnitOpStatus }) => (
  <span className={clsx(
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
    STATUS_STYLES[status]
  )}>
    {status}
  </span>
)