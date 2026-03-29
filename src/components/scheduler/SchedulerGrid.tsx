import { useEffect } from 'react'
import { useScheduleStore } from '@/store/scheduleStore'
import { DateHeader } from './DateHeader'
import { EquipmentLane } from './EquipmentLane'
import { getDaysInRange } from '@/utils/dateUtils'
import type { UnitOperation } from '@/types'
import { Loader2, LayoutGrid, Info, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface SchedulerGridProps {
  onOpClick: (op: UnitOperation) => void
}

const BATCH_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

export const SchedulerGrid = ({ onOpClick }: SchedulerGridProps) => {
  const {
    equipment, batches, unitOps, violations,
    startDate, endDate, isLoading, error, fetchSchedule,
  } = useScheduleStore()

  // Senior Tip: Fetch only if date range exists to prevent API crashes
  useEffect(() => { 
    if (startDate && endDate) fetchSchedule() 
  }, [startDate, endDate, fetchSchedule])

  const days = getDaysInRange(startDate, endDate)
  const totalDays = days.length

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-100 gap-4">
      <div className="relative">
        <Loader2 size={40} className="animate-spin text-slate-200" strokeWidth={1} />
        <Loader2 size={40} className="animate-spin text-indigo-600 absolute inset-0 [animation-delay:-0.3s]" strokeWidth={2.5} />
      </div>
      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Synchronizing Engine...</span>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 bg-red-50/50 rounded-3xl border border-red-100 mx-6 mt-6">
      <AlertCircle className="text-red-400 mb-2" size={32} />
      <span className="text-sm font-bold text-red-600 uppercase tracking-tight">System Sync Error</span>
      <p className="text-xs text-red-400 mt-1">{error}</p>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* 1. Dashboard Legend: High-Density Info */}
      <div className="flex items-center justify-between px-8 py-4 bg-white/40 backdrop-blur-sm border-b border-slate-200/60 sticky left-0 z-30">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pr-4">
          {batches.map((batch, i) => (
            <div key={batch.id} className="flex items-center gap-3 shrink-0 group">
              <div 
                className="w-1.5 h-8 rounded-full shadow-sm transition-all group-hover:scale-y-110"
                style={{ backgroundColor: BATCH_COLORS[i % BATCH_COLORS.length] }}
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-tight">{batch.name}</span>
                <span className="text-[10px] font-medium text-slate-400">
                  {format(parseISO(batch.start), 'MMM d')} - {format(parseISO(batch.end), 'MMM d')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Stats Pill */}
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-2xl shadow-lg shrink-0 ml-4">
          <LayoutGrid size={14} className="text-slate-400" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{unitOps.length} Ops</span>
          <div className="w-px h-3 bg-slate-700 mx-1" />
          {violations.length > 0 ? (
             <span className="text-[10px] font-black text-red-400 uppercase tracking-widest animate-pulse">
               {violations.length} Conflicts
             </span>
          ) : (
             <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Optimized</span>
          )}
        </div>
      </div>

      {/* 3. The Gantt Grid: Seamless Scroll */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50/30">
        <div className="inline-block min-w-full p-6 pt-0">
          <div className="bg-white rounded-4xl border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
            <div style={{ minWidth: `${Math.max(totalDays * 48 + 180, 1000)}px` }}>
              <DateHeader days={days} />
              
              <div className="divide-y divide-slate-100">
                {equipment.map((eq, i) => (
                  <EquipmentLane
                    key={eq.id}
                    equipment={eq}
                    unitOps={unitOps.filter((op) => op.equipment_id === eq.id)}
                    batches={batches}
                    allUnitOps={unitOps}
                    rangeStart={startDate}
                    rangeEnd={endDate}
                    totalDays={totalDays}
                    violations={violations}
                    onOpClick={onOpClick}
                    isEven={i % 2 === 0}
                    isLast={i === equipment.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 4. Footer Help Tip */}
          <div className="mt-6 flex items-center gap-2 justify-center text-slate-400">
             <Info size={14} />
             <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
               Click any block to modify parameters • Drag to scroll timeline
             </span>
          </div>
        </div>
      </div>
    </div>
  )
}