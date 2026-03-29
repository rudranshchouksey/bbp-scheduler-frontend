import clsx from 'clsx'
import { AlertTriangle, Clock } from 'lucide-react'
import type { UnitOperation, Violation } from '@/types'
import { getPositionStyle } from '@/utils/dateUtils'
import { format, parseISO, differenceInHours } from 'date-fns'

interface UnitOpBlockProps {
  op: UnitOperation
  rangeStart: string
  totalDays: number
  violations: Violation[]
  onClick: (op: UnitOperation) => void
  style?: React.CSSProperties
}

export const UnitOpBlock = ({
  op, rangeStart, totalDays, violations, onClick,
}: UnitOpBlockProps) => {
  const hasViolation = violations.some((v) => v.unit_op_id === op.id)
  const pos = getPositionStyle(op.start, op.end, rangeStart, totalDays)
  
  // Calculate duration for the "Unique" badge
  const durationHours = differenceInHours(parseISO(op.end), parseISO(op.start))

  return (
    <div
      onClick={() => onClick(op)}
      className={clsx(
        'absolute top-2 bottom-2 cursor-pointer group',
        'flex items-center gap-2 pr-3 pl-0 transition-all duration-300 ease-out',
        'rounded-xl border border-white/20 overflow-hidden select-none',
        'hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-[0.98]',
        hasViolation ? 'violation-glow z-40' : 'shadow-sm z-10'
      )}
      style={{
        left: pos.left,
        width: pos.width,
        backgroundColor: `${op.color}cc`, // 80% opacity for glass effect
        backdropFilter: 'blur(8px)',
        minWidth: '60px',
      }}
    >
      {/* 1. STATUS ACCENT BAR: High-end indicator on the left */}
      <div 
        className={clsx(
          "w-1.5 h-full shrink-0 transition-all duration-500",
          op.status === 'completed' ? 'bg-white' : 
          op.status === 'confirmed' ? 'bg-white/40' : 'bg-black/10'
        )} 
      />

      {/* 2. CONTENT AREA */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {hasViolation && (
            <AlertTriangle size={12} className="text-white shrink-0 animate-pulse fill-red-500/20" />
          )}
          
          <span className="text-white text-[11px] font-extrabold truncate uppercase tracking-tight leading-none">
            {op.name}
          </span>
        </div>

        {/* 3. DURATION BADGE (Appears on hover or if wide enough) */}
        <div className="flex items-center gap-1 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <Clock size={10} className="text-white/80" />
          <span className="text-[9px] font-bold text-white/90">
            {durationHours}h
          </span>
        </div>
      </div>

      {/* 4. REFINED GLOSS OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
      
      {/* Tooltip Styling */}
      <div className="sr-only">
        {`${op.name} (${op.status})\n${format(parseISO(op.start), 'MMM d, HH:mm')} → ${format(parseISO(op.end), 'HH:mm')}`}
      </div>
    </div>
  )
}