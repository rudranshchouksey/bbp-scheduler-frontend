import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { SchedulerGrid } from '@/components/scheduler/SchedulerGrid'
import { UnitOpModal } from '@/components/modals/UnitOpModal'
import { CreateUnitOpModal } from '@/components/modals/CreateUnitOpModal'
import { ViolationDrawer } from '@/components/ui/ViolationPanel'
import { useScheduleStore } from '@/store/scheduleStore'
import { ShieldAlert, ChevronRight } from 'lucide-react'
import type { UnitOperation } from '@/types'

export default function App() {
  const [selectedOp, setSelectedOp] = useState<UnitOperation | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViolationDrawer, setShowViolationDrawer] = useState(false)
  
  const { violations, fetchSchedule, startDate, endDate, equipment, batches } = useScheduleStore()

  useEffect(() => {
    fetchSchedule()
  }, [startDate, endDate, fetchSchedule])

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#f8fafc] font-sans antialiased">
      <Toaster position="top-right" expand={false} richColors />

      <Header onCreateClick={() => setShowCreateModal(true)} />

      <main className="flex-1 relative flex flex-col min-h-0">
        
        <div className="flex-1 overflow-hidden flex flex-col">
           <SchedulerGrid onOpClick={setSelectedOp} />
        </div>

        {violations.length > 0 && (
          <div className="absolute bottom-10 right-10 z-60">
            <button 
              onClick={() => setShowViolationDrawer(true)}
              className="flex items-center gap-4 pl-2 pr-6 py-2 bg-slate-900 text-white rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:bg-black transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-white/10"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40">
                <ShieldAlert size={18} className="animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Logic Warning</span>
                <span className="text-[13px] font-bold tracking-tight">{violations.length} Active Conflicts</span>
              </div>
              <ChevronRight size={14} className="text-slate-500 ml-2" />
            </button>
          </div>
        )}

        <ViolationDrawer 
          violations={violations} 
          isOpen={showViolationDrawer} 
          onClose={() => setShowViolationDrawer(false)} 
          onEditOp={(op) => setSelectedOp(op)}
        />
      </main>

      {selectedOp && (
        <UnitOpModal op={selectedOp} equipment={equipment} batches={batches} onClose={() => setSelectedOp(null)} />
      )}
      {showCreateModal && (
        <CreateUnitOpModal equipment={equipment} batches={batches} onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}