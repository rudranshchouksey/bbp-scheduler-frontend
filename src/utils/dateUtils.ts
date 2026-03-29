import { differenceInDays, parseISO, eachDayOfInterval, format } from 'date-fns'

export const getDaysInRange = (start: string, end: string): Date[] => {
  return eachDayOfInterval({
    start: parseISO(start.split('T')[0]),
    end: parseISO(end.split('T')[0]),
  })
}

export const getPositionStyle = (
  opStart: string,
  opEnd: string,
  rangeStart: string,
  totalDays: number
): { left: string; width: string } => {
  const rangeStartDate = parseISO(rangeStart.split('T')[0])
  const opStartDate = parseISO(opStart.split('T')[0])
  const opEndDate = parseISO(opEnd.split('T')[0])

  const startOffset = Math.max(0, differenceInDays(opStartDate, rangeStartDate))
  const duration = Math.max(1, differenceInDays(opEndDate, opStartDate))

  return {
    left: `${(startOffset / totalDays) * 100}%`,
    width: `${(duration / totalDays) * 100}%`,
  }
}

export const formatDateForInput = (dateStr: string): string => {
  return dateStr.split('.')[0]
}

export const formatDisplayDate = (dateStr: string): string => {
  return format(parseISO(dateStr), 'MMM d')
}