import { format, formatDistanceToNow, isToday, isTomorrow, isThisWeek, isPast, addDays, differenceInDays } from 'date-fns'

/**
 * Check if a date is overdue (past due date and not today)
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false
  const date = new Date(dueDate)
  return isPast(date) && !isToday(date)
}

/**
 * Check if a date is due soon (within 7 days)
 */
export const isDueSoon = (dueDate) => {
  if (!dueDate) return false
  const date = new Date(dueDate)
  const daysUntil = differenceInDays(date, new Date())
  return daysUntil >= 0 && daysUntil <= 7
}

/**
 * Get urgency level based on due date
 */
export const getUrgency = (dueDate) => {
  if (!dueDate) return 'low'
  const date = new Date(dueDate)
  const daysUntil = differenceInDays(date, new Date())
  
  if (isPast(date) && !isToday(date)) return 'overdue'
  if (daysUntil <= 1) return 'urgent'
  if (daysUntil <= 2) return 'high'
  if (daysUntil <= 7) return 'medium'
  return 'low'
}

/**
 * Format due date for display
 */
export const formatDueDate = (dueDate) => {
  if (!dueDate) return ''
  const date = new Date(dueDate)
  
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isOverdue(dueDate)) return `Overdue (${format(date, 'MMM d')})`
  if (isThisWeek(date)) return format(date, 'EEEE')
  
  return format(date, 'MMM d, yyyy')
}

/**
 * Format due date with time
 */
export const formatDueDateWithTime = (dueDate, dueTime) => {
  if (!dueDate) return ''
  const dateStr = formatDueDate(dueDate)
  if (dueTime && dueTime !== '23:59') {
    return `${dateStr} at ${dueTime}`
  }
  return dateStr
}

/**
 * Get relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Format date for input fields
 */
export const formatDateForInput = (date) => {
  if (!date) return ''
  return format(new Date(date), 'yyyy-MM-dd')
}

/**
 * Get days until due
 */
export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null
  return differenceInDays(new Date(dueDate), new Date())
}

/**
 * Group assignments by due date category
 */
export const groupAssignmentsByDate = (assignments) => {
  const groups = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: []
  }

  assignments.forEach(assignment => {
    const date = new Date(assignment.dueDate)
    
    if (isOverdue(assignment.dueDate) && assignment.status !== 'completed') {
      groups.overdue.push(assignment)
    } else if (isToday(date)) {
      groups.today.push(assignment)
    } else if (isTomorrow(date)) {
      groups.tomorrow.push(assignment)
    } else if (isThisWeek(date)) {
      groups.thisWeek.push(assignment)
    } else {
      groups.later.push(assignment)
    }
  })

  return groups
}
