import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Trash2, Check, Beaker, Clock, Database, AlertCircle, Loader2 } from 'lucide-react'
import { useScheduleStore } from '@/store/scheduleStore'
import { toast } from 'sonner'
import { formatDateForInput } from '@/utils/dateUtils'
import clsx from 'clsx'

import type { UnitOperation, Equipment, Batch } from '@/types'

/* -------------------- PROPS -------------------- */
interface UnitOpModalProps {
  op: UnitOperation
  equipment: Equipment[]
  batches: Batch[]
  onClose: () => void
}

/* -------------------- SCHEMA -------------------- */
const schema = z.object({
  name: z.enum(['Seed', 'Bioreactor', 'TFF', 'Spray', 'Sum']),
  status: z.enum(['draft', 'confirmed', 'completed']),
  start: z.string(),
  end: z.string(),
  equipment_id: z.number(),
})
type FormData = z.infer<typeof schema>

/* -------------------- COLORS -------------------- */
const OP_COLORS: Record<string, string> = {
  Seed: '#6366f1',
  Bioreactor: '#0ea5e9',
  TFF: '#10b981',
  Spray: '#f59e0b',
  Sum: '#ef4444',
}

/* -------------------- COMPONENT -------------------- */
export const UnitOpModal = ({ op, equipment, batches, onClose }: UnitOpModalProps) => {
  const { updateUnitOp, deleteUnitOp, violations } = useScheduleStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const batch = batches.find((b) => b.id === op.batch_id)
  const hasConflict = violations.some((v) => v.unit_op_id === op.id)

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver:zodResolver(schema),
    defaultValues: {
      name: op.name,
      status: op.status,
      start: formatDateForInput(op.start),
      end: formatDateForInput(op.end),
      equipment_id: op.equipment_id,
    },
  })

  const watched = watch()

  /* -------------------- SUBMIT -------------------- */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await updateUnitOp(op.id, {
        ...data,
        color: OP_COLORS[data.name],
        start: new Date(data.start).toISOString(),
        end: new Date(data.end).toISOString(),
      })

      toast.success('Database Updated')
      onClose()
    } catch {
      toast.error('Update Failed')
    }
  }

  /* -------------------- DELETE -------------------- */
  const handleDelete = async () => {
    if (!confirm('Confirm deletion of this operation?')) return
    setIsDeleting(true)
    try {
      await deleteUnitOp(op.id)
      onClose()
    } catch {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-125 overflow-hidden flex flex-col border border-slate-200">

        {/* HEADER */}
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner"
              style={{ backgroundColor: OP_COLORS[watched.name] }}
            >
              <Beaker size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">
                Edit Operation
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                {batch?.name} · ID: {op.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">

          {/* TYPE */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2">
              <Database size={14} /> Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(OP_COLORS).map((name) => (
                <label key={name} className="cursor-pointer">
                  <input type="radio" value={name} {...register('name')} className="sr-only" />
                  <div
                    className={clsx(
                      "py-2 px-1 text-center rounded-lg text-[10px] font-black uppercase transition-all border-2",
                      watched.name === name
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                    )}
                  >
                    {name}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* EQUIPMENT */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase">
              Equipment Asset
            </label>
            <select
              {...register('equipment_id')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700"
            >
              {equipment.map((eq: Equipment) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>

          {/* TIME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <Clock size={14} /> Start
              </label>
              <input
                type="datetime-local"
                {...register('start')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <Clock size={14} /> End
              </label>
              <input
                type="datetime-local"
                {...register('end')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold"
              />
            </div>
          </div>

          {/* CONFLICT WARNING */}
          {hasConflict && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-[10px] text-red-600 font-bold uppercase">
                Conflict Detected: This window overlaps with another scheduled operation.
              </p>
            </div>
          )}

          {/* STATUS */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['draft', 'confirmed', 'completed'].map((s) => (
              <label key={s} className="flex-1 cursor-pointer">
                <input type="radio" value={s} {...register('status')} className="sr-only" />
                <div
                  className={clsx(
                    "text-center py-2 rounded-lg text-[10px] font-bold uppercase",
                    watched.status === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                  )}
                >
                  {s}
                </div>
              </label>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 border"
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-slate-900 text-white py-4 rounded-xl text-[11px] font-black uppercase"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
              <Check size={16} />
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}