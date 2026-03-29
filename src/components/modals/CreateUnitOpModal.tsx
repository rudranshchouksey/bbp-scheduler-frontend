import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, Beaker, Layers, CheckCircle2, Database, Clock } from 'lucide-react'
import { useScheduleStore } from '@/store/scheduleStore'
import { toast } from 'sonner'
import clsx from 'clsx'
import type { Equipment, Batch } from '@/types'

interface CreateUnitOpModalProps {
  equipment: Equipment[]
  batches: Batch[]
  onClose: () => void
}

const schema = z.object({
  name: z.enum(['Seed', 'Bioreactor', 'TFF', 'Spray', 'Sum']),
  status: z.enum(['draft', 'confirmed', 'completed']),
  start: z.string(),
  end: z.string(),
  batch_id: z.number(),
  equipment_id: z.number()
})

type FormData = z.infer<typeof schema>

const OP_COLORS: Record<string, string> = {
  Seed: '#6366f1', Bioreactor: '#0ea5e9',
  TFF: '#10b981', Spray: '#f59e0b', Sum: '#ef4444',
}

export const CreateUnitOpModal = ({ equipment, batches, onClose }: CreateUnitOpModalProps) => {
  const { createUnitOp } = useScheduleStore()

  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: 'Seed',
      status: 'draft',
      start: '',
      end: '',
      batch_id: batches[0]?.id ?? 0,
      equipment_id: equipment[0]?.id ?? 0,
    },
  })

  const watchedName = watch('name')
  const watchedStatus = watch('status')

  const onSubmit = async (data: FormData) => {
    try {
      await createUnitOp({
        ...data,
        color: OP_COLORS[data.name],
        start: new Date(data.start).toISOString(),
        end: new Date(data.end).toISOString(),
      })
      toast.success('Sequence Synchronized')
      onClose()
    } catch (err: any) {
      toast.error('Sync Failed')
    }
  }

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      
      {/* 1. MAIN CONTAINER: Sharp, clean corners (12px radius) */}
      <div className="bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-135 overflow-hidden flex flex-col border border-slate-200">
        
        {/* 2. HEADER: High-Contrast Navy/Slate */}
        <div className="bg-[#1e293b] px-8 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Plus size={18} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-white font-bold text-xs uppercase tracking-[0.2em] leading-none">System Initialization</h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1.5 opacity-60">Manual Override Plan</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded">
            <X size={18} />
          </button>
        </div>

        {/* 3. FORM BODY: High-Density Layout */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 bg-white">

          {/* Section: Protocol (Sharp Rectangular Buttons) */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} className="text-slate-300" /> Protocol Assignment
            </label>
            <div className="flex gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
              {(['Seed', 'Bioreactor', 'TFF', 'Spray', 'Sum'] as const).map((name) => (
                <label key={name} className="flex-1 cursor-pointer">
                  <input type="radio" value={name} {...register('name')} className="sr-only" />
                  <div className={clsx(
                    "h-9 flex items-center justify-center rounded text-[10px] font-black uppercase tracking-wider transition-all",
                    watchedName === name 
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" 
                      : "text-slate-400 hover:text-slate-600"
                  )}>
                    {name}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section: Logic Mapping */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Database size={14} className="text-slate-300" /> Batch ID
              </label>
              <select {...register('batch_id')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Beaker size={14} className="text-slate-300" /> Equipment
              </label>
              <select {...register('equipment_id')} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                {equipment.map((eq) => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
            </div>
          </div>

          {/* Section: Timeline (Refined Box) */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-slate-300" /> Temporal Window
            </label>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Inbound</span>
                <input type="datetime-local" {...register('start')} className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-[11px] font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Outbound</span>
                <input type="datetime-local" {...register('end')} className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-[11px] font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all" />
              </div>
            </div>
          </div>

          {/* Section: Deployment State (Segmented Control) */}
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1 gap-1">
            {['draft', 'confirmed'].map((s) => (
              <label key={s} className="flex-1 cursor-pointer">
                <input type="radio" value={s} {...register('status')} className="sr-only" />
                <div className={clsx(
                  "text-center py-2 rounded text-[9px] font-black uppercase tracking-[0.25em] transition-all",
                  watchedStatus === s ? "bg-[#1e293b] text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                )}>
                  {s}
                </div>
              </label>
            ))}
          </div>

          {/* Footer Actions: Flush & Sharp */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-[#1e293b] text-white py-3.5 rounded-lg text-[11px] font-black uppercase tracking-[0.3em] shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isSubmitting ? 'Syncing...' : 'Commit to Schedule'}
              <CheckCircle2 size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}