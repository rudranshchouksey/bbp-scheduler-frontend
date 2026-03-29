import axios from 'axios'
import type {
  ScheduleResponse,
  UnitOpCreatePayload,
  UnitOpUpdatePayload,
  UnitOperation,
} from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const scheduleApi = {
  getSchedule: async (startDate: string, endDate: string): Promise<ScheduleResponse> => {
    const { data } = await api.get('/schedule', {
      params: { start_date: startDate, end_date: endDate },
    })
    return data
  },

  createUnitOp: async (payload: UnitOpCreatePayload): Promise<UnitOperation> => {
    const { data } = await api.post('/unit_operations', payload)
    return data
  },

  updateUnitOp: async (id: number, payload: UnitOpUpdatePayload): Promise<UnitOperation> => {
    const { data } = await api.put(`/unit_operations/${id}`, payload)
    return data
  },

  deleteUnitOp: async (id: number): Promise<void> => {
    await api.delete(`/unit_operations/${id}`)
  },
}