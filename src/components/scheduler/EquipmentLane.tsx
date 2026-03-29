import { useMemo } from 'react'
import type { Equipment, UnitOperation, Batch, Violation } from '@/types'
import { UnitOpBlock } from './UnitOpBlock'
import { getPositionStyle, getDaysInRange } from '@/utils/dateUtils'
import { isToday } from 'date-fns'
import clsx from 'clsx'

interface EquipmentLaneProps {
  equipment: Equipment
  unitOps: UnitOperation[]
  batches: Batch[]
  allUnitOps: UnitOperation[]
  rangeStart: string
  rangeEnd: string
  totalDays: number
  violations: Violation[]
  onOpClick: (op: UnitOperation) => void
  isEven: boolean
  isLast: boolean
}

const BATCH_COLORS = [
  { bg: 'rgba(99,102,241,0.04)', border: 'rgba(99,102,241,0.2)' },
  { bg: 'rgba(14,165,233,0.04)', border: 'rgba(14,165,233,0.2)' },
  { bg: 'rgba(16,185,129,0.04)', border: 'rgba(16,185,129,0.2)' },
  { bg: 'rgba(245,158,11,0.04)', border: 'rgba(245,158,11,0.2)' },
  { bg: 'rgba(239,68,68,0.04)', border: 'rgba(239,68,68,0.2)' },
]

export const EquipmentLane = ({
  equipment, unitOps, batches, allUnitOps,
  rangeStart, rangeEnd, totalDays,
  violations, onOpClick, isEven
}: EquipmentLaneProps) => {

  const days = useMemo(() => getDaysInRange(rangeStart, rangeEnd), [rangeStart, rangeEnd])
  const todayIndex = days.findIndex((d) => isToday(d))

  // --- OVERLAP RESOLUTION LOGIC ---
  const rows = useMemo(() => {
    const sortedOps = [...unitOps].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const levels: UnitOperation[][] = [];

    sortedOps.forEach(op => {
      let placed = false;
      for (let i = 0; i < levels.length; i++) {
        const lastOpInLevel = levels[i][levels[i].length - 1];
        // If this op starts after the last op in this level ends, place it here
        if (new Date(op.start) >= new Date(lastOpInLevel.end)) {
          levels[i].push(op);
          placed = true;
          break;
        }
      }
      if (!placed) levels.push([op]);
    });
    return levels;
  }, [unitOps]);

  const rowHeight = 44; // Height per stacked block
  const lanePadding = 24;
  const laneHeight = Math.max(88, (rows.length * rowHeight) + lanePadding);

  // Batch envelopes logic
  const batchEnvelopes = useMemo(() => {
    return batches.map((batch, idx) => {
      const batchOpsOnLane = unitOps.filter((op) => op.batch_id === batch.id)
      if (!batchOpsOnLane.length) return null
      const allBatchOps = allUnitOps.filter((op) => op.batch_id === batch.id)
      const minStart = allBatchOps.reduce((min, op) => op.start < min ? op.start : min, allBatchOps[0].start)
      const maxEnd = allBatchOps.reduce((max, op) => op.end > max ? op.end : max, allBatchOps[0].end)
      const pos = getPositionStyle(minStart, maxEnd, rangeStart, totalDays)
      return { batch, pos, color: BATCH_COLORS[idx % BATCH_COLORS.length] }
    }).filter(Boolean)
  }, [batches, unitOps, allUnitOps, rangeStart, totalDays]);

  return (
    <div 
      className={clsx('flex group relative transition-all duration-300 border-b border-slate-100', isEven ? 'bg-white' : 'bg-slate-50/40')}
      style={{ height: `${laneHeight}px` }}
    >
      {/* Sidebar Label */}
      <div className="w-44 min-w-44 shrink-0 border-r border-slate-200/60 flex items-center px-6 sticky left-0 z-30 bg-inherit shadow-[10px_0_15px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">{equipment.name}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{unitOps.length} ACTIVE</span>
        </div>
      </div>

      {/* Timeline Workspace */}
      <div className="flex-1 relative overflow-hidden">
        {/* Day Grid Lines */}
        <div className="absolute inset-0 flex pointer-events-none">
          {days.map((day, i) => (
            <div key={i} className={clsx('flex-1 border-r border-slate-100/50', isToday(day) && 'bg-indigo-50/30')} />
          ))}
        </div>

        {/* Batch Envelopes: Now more subtle and professional */}
        {batchEnvelopes.map((env) => env && (
          <div
            key={env.batch.id}
            className="absolute top-1 bottom-1 rounded-2xl pointer-events-none transition-all duration-500"
            style={{
              left: env.pos.left,
              width: env.pos.width,
              backgroundColor: env.color.bg,
              border: `1px dashed ${env.color.border}`,
            }}
          />
        ))}

        {/* Today Red Line */}
        {todayIndex >= 0 && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 z-20 pointer-events-none" 
            style={{ 
              left: `${((todayIndex + 0.5) / totalDays) * 100}%`,
              background: 'linear-gradient(to bottom, transparent, #ef4444, transparent)' 
            }} 
          />
        )}

        {/* Stacked UnitOp Blocks */}
        {rows.map((row, rowIndex) => (
          row.map((op) => (
            <UnitOpBlock
              key={op.id}
              op={op}
              rangeStart={rangeStart}
              totalDays={totalDays}
              violations={violations}
              onClick={onOpClick}
              style={{ top: `${(rowIndex * rowHeight) + 12}px`, height: '32px' }}
            />
          ))
        ))}
      </div>
    </div>
  )
}