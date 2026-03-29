import { format, isToday, isWeekend, isFirstDayOfMonth } from 'date-fns'
import clsx from 'clsx'
import { useMemo } from 'react'

interface DateHeaderProps {
  days: Date[]
}

export const DateHeader = ({ days }: DateHeaderProps) => {
  // Senior Tip: Group days by month to create a cleaner "Top Tier" month indicator
  const monthGroups = useMemo(() => {
    const groups: { month: string; span: number }[] = []
    days.forEach((day) => {
      const monthName = format(day, 'MMMM yyyy')
      if (groups.length === 0 || groups[groups.length - 1].month !== monthName) {
        groups.push({ month: monthName, span: 1 })
      } else {
        groups[groups.length - 1].span++
      }
    })
    return groups
  }, [days])

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      
      {/* --- TOP TIER: Month Indicator --- */}
      <div className="flex border-b border-slate-100">
        <div className="w-44 min-w-44 shrink-0 border-r border-slate-200/60 bg-slate-50/50" />
        <div className="flex flex-1">
          {monthGroups.map((group, i) => (
            <div 
              key={i} 
              style={{ flex: `0 0 ${(group.span / days.length) * 100}%` }}
              className="py-2 px-4 border-r border-slate-100 last:border-r-0"
            >
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {group.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTTOM TIER: Day Grid --- */}
      <div className="flex">
        {/* Sidebar Corner */}
        <div className="w-44 min-w-44 shrink-0 border-r border-slate-200/60 px-6 py-4 flex items-center bg-slate-50/30">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Equipment Assets
          </span>
        </div>

        {/* Days Scrollable Area */}
        <div className="flex flex-1">
          {days.map((day, i) => {
            const today = isToday(day)
            const weekend = isWeekend(day)
            
            return (
              <div
                key={i}
                className={clsx(
                  'flex-1 min-w-12 flex flex-col items-center justify-center py-3 border-r last:border-r-0 transition-colors',
                  today ? 'bg-indigo-50/50' : weekend ? 'bg-slate-50/80' : 'bg-transparent',
                  'border-r-slate-100/60'
                )}
              >
                <span className={clsx(
                  'text-[9px] font-extrabold uppercase tracking-tighter mb-1',
                  today ? 'text-indigo-600' : weekend ? 'text-slate-300' : 'text-slate-400'
                )}>
                  {format(day, 'EEE')}
                </span>
                
                <div className={clsx(
                  'w-7 h-7 flex items-center justify-center rounded-full text-xs font-black transition-all',
                  today 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-110' 
                    : weekend ? 'text-slate-400' : 'text-slate-700'
                )}>
                  {format(day, 'd')}
                </div>

                {/* Subtle marker for the start of a month if multi-month view */}
                {isFirstDayOfMonth(day) && i !== 0 && (
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-300" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}