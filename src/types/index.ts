export interface Equipment {
  id: number
  name: string
}

export interface Batch {
  id: number
  name: string
  start: string
  end: string
}

export type UnitOpName = 'Seed' | 'Bioreactor' | 'TFF' | 'Spray' | 'Sum'
export type UnitOpStatus = 'draft' | 'confirmed' | 'completed'

export interface UnitOperation {
  id: number
  name: UnitOpName
  color: string
  status: UnitOpStatus
  start: string
  end: string
  batch_id: number
  equipment_id: number
}

export interface Violation {
  unit_op_id: number
  type: 'sequence_order' | 'equipment_overlap'
  message: string
}

export interface ScheduleResponse {
  equipment: Equipment[]
  batches: Batch[]
  unit_ops: UnitOperation[]
  violations: Violation[]
}

export interface UnitOpCreatePayload {
  name: UnitOpName
  status: UnitOpStatus
  start: string
  end: string
  batch_id: number
  equipment_id: number
  color?: string
}

export interface UnitOpUpdatePayload {
  name?: UnitOpName
  status?: UnitOpStatus
  start?: string
  end?: string
  equipment_id?: number
  color?: string
}