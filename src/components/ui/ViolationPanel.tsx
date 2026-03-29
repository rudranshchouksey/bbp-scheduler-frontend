import { AlertTriangle, X, ChevronRight, Info, ShieldAlert, Zap, Edit3 } from 'lucide-react'
import type { Violation, UnitOperation } from '@/types'
import { useScheduleStore } from '@/store/scheduleStore'
import clsx from 'clsx'

interface ViolationDrawerProps {
  violations: Violation[]
  isOpen: boolean
  onClose: () => void
  onEditOp: (op: UnitOperation) => void // New prop to trigger the Edit Modal
}

export const ViolationDrawer = ({ violations, isOpen, onClose, onEditOp }: ViolationDrawerProps) => {
  const { unitOps } = useScheduleStore()

  // Senior Tip: We handle the search logic here to keep App.tsx clean
  const handleFixClick = (unitOpId: number) => {
    const targetOp = unitOps.find(op => op.id === unitOpId)
    if (targetOp) {
      onEditOp(targetOp) // Opens the Edit Modal in App.tsx
      onClose()          // Closes the drawer for a focused editing experience
    }
  }

  return (
    <>
      {/* 1. Backdrop: Soft Blur for Depth */}
      <div 
        className={clsx(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-100 transition-all duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* 2. Diagnostic Side Panel */}
      <div className={clsx(
        "fixed right-0 top-0 h-full w-100 bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.15)] z-101 transform transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] border-l border-slate-200/60 flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        
        {/* --- HEADER: Glassmorphism & System Status --- */}
        <div className="p-8 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/60 relative overflow-hidden shrink-0">
          {/* Subtle Watermark */}
          <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none rotate-12">
             <ShieldAlert size={160} />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[20px] bg-red-500 flex items-center justify-center shadow-lg shadow-red-200">
                <AlertTriangle size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Diagnostic</h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Conflict Engine Active</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              className="p-2.5 hover:bg-white hover:shadow-md rounded-2xl transition-all active:scale-90 border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* Issue Counter Bar */}
          <div className="flex items-center gap-4 bg-white/80 rounded-[22px] p-4 border border-slate-200/50 shadow-sm relative z-10">
             <div className="flex-1">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-linear-to-r from-red-500 to-orange-400 w-full" />
                </div>
             </div>
             <span className="text-xs font-black text-slate-800 tracking-tighter shrink-0 uppercase">
               {violations.length} Critical Issues
             </span>
          </div>
        </div>

        {/* --- CONTENT: High-Fidelity Violation Cards --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#fcfcfd]">
          {violations.map((v, i) => (
            <div 
              key={i} 
              className="group relative bg-white p-6 rounded-[28px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-red-500/5 hover:border-red-200 transition-all duration-300 overflow-hidden"
            >
              {/* Type Badge & Status */}
              <div className="flex items-center justify-between mb-4">
                <div className={clsx(
                  "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                  v.type === 'equipment_overlap' 
                    ? "bg-amber-50 text-amber-600 border-amber-100" 
                    : "bg-red-50 text-red-600 border-red-100"
                )}>
                  {v.type.replace('_', ' ')}
                </div>
                <Zap size={14} className="text-slate-200 group-hover:text-amber-400 transition-colors" />
              </div>

              {/* Message with improved line height */}
              <p className="text-[13px] text-slate-600 leading-[1.6] font-semibold mb-6 pr-2">
                {v.message}
              </p>

              {/* Action: Interactive Fix Button */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                   {[...Array(3)].map((_, i) => (
                     <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100" />
                   ))}
                </div>
                
                <button 
                  onClick={() => handleFixClick(v.unit_op_id)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all transform group-hover:translate-x-0 translate-x-4 opacity-0 group-hover:opacity-100"
                >
                  <Edit3 size={12} />
                  Open Editor
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- FOOTER: Actionable Guidance --- */}
        <div className="p-8 bg-white border-t border-slate-100 shrink-0">
          <div className="bg-slate-900 rounded-[30px] p-6 shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700 text-white">
               <Info size={100} />
            </div>
            
            <div className="flex gap-4 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                <Info size={18} className="text-white" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Resolution Logic</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Conflicts must be zeroed to confirm the plan. Use the editor to shift operation windows or reassign equipment assets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}