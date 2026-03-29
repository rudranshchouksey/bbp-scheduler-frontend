import { create } from 'zustand'
import { scheduleApi } from '@/api/scheduleApi'
import type {
  Equipment, Batch, UnitOperation,
  Violation, UnitOpUpdatePayload, UnitOpCreatePayload,
} from '@/types'
import { format } from 'date-fns'

interface ScheduleState {
  equipment: Equipment[]
  batches: Batch[]
  unitOps: UnitOperation[]
  violations: Violation[]
  startDate: string
  endDate: string
  isLoading: boolean
  error: string | null
  setDateRange: (start: string, end: string) => void
  fetchSchedule: () => Promise<void>
  updateUnitOp: (id: number, payload: UnitOpUpdatePayload) => Promise<void>
  createUnitOp: (payload: UnitOpCreatePayload) => Promise<void>
  deleteUnitOp: (id: number) => Promise<void>
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  equipment: [],
  batches: [],
  unitOps: [],
  violations: [],
  startDate: format(new Date('2026-03-01'), "yyyy-MM-dd'T'HH:mm:ss"),
  endDate: format(new Date('2026-03-31'), "yyyy-MM-dd'T'23:59:59"),
  isLoading: false,
  error: null,

  setDateRange: (start, end) => {
    set({ startDate: start, endDate: end })
    get().fetchSchedule()
  },

  fetchSchedule: async () => {
    set({ isLoading: true, error: null })
    try {
      const { startDate, endDate } = get()
      const data = await scheduleApi.getSchedule(startDate, endDate)
      set({
        equipment: data.equipment,
        batches: data.batches,
        unitOps: data.unit_ops,
        violations: data.violations,
        isLoading: false,
      })
    } catch (err) {
      set({ error: 'Failed to fetch schedule', isLoading: false })
    }
  },

  updateUnitOp: async (id, payload) => {
    await scheduleApi.updateUnitOp(id, payload)
    await get().fetchSchedule()
  },

  createUnitOp: async (payload) => {
    await scheduleApi.createUnitOp(payload)
    await get().fetchSchedule()
  },

  deleteUnitOp: async (id) => {
    await scheduleApi.deleteUnitOp(id)
    await get().fetchSchedule()
  },
}))