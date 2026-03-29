import { FlaskConical, RefreshCw, Plus, Calendar as CalendarIcon } from 'lucide-react'
import { useScheduleStore } from '@/store/scheduleStore'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  onCreateClick: () => void
}

export const Header = ({ onCreateClick }: HeaderProps) => {
  const { startDate, endDate, setDateRange, fetchSchedule, isLoading } = useScheduleStore()

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    // Ensuring clean ISO strings for API stability
    const newStart = field === 'start' ? `${value}T00:00:00.000Z` : startDate
    const newEnd = field === 'end' ? `${value}T23:59:59.999Z` : endDate
    setDateRange(newStart, newEnd)
  }

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/60 px-8 py-3 flex items-center justify-between">
      {/* Brand Section: More focused & sophisticated */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
            <FlaskConical size={20} className="text-cyan-400" />
          </div>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">BBP Scheduler</h1>
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Live Monitoring</p>
          </div>
        </div>
      </div>

      {/* Control Cluster */}
      <div className="flex items-center gap-6">
        {/* Refined Date Range: Single pill design */}
        <div className="flex items-center bg-white border border-slate-200 rounded-full pl-4 pr-2 py-1 shadow-sm hover:border-slate-300 transition-colors">
          <CalendarIcon size={14} className="text-slate-400 mr-3" />
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate.split('T')[0]}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="text-xs font-semibold text-slate-600 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors"
            />
            <span className="text-slate-300 font-light mx-1">|</span>
            <input
              type="date"
              value={endDate.split('T')[0]}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="text-xs font-semibold text-slate-600 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors"
            />
          </div>

          <div className="ml-4 h-6 w-px bg-slate-200 mr-2" />

          <button
            onClick={fetchSchedule}
            disabled={isLoading}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={`${isLoading ? 'animate-spin' : ''} text-slate-500`} />
          </button>
        </div>

        {/* Action Button: High contrast */}
        <Button
          variant="primary"
          size="sm"
          onClick={onCreateClick}
          className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-5 shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={16} className="mr-1.5" />
          <span className="text-xs font-bold uppercase tracking-wide">New Batch</span>
        </Button>
      </div>
    </header>
  )
}