import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getAssignmentsByUser } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Spinner from '../components/common/Spinner'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns'

const Calendar = () => {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (!user) return

    // Load assignments from localStorage
    const userAssignments = getAssignmentsByUser(user.id)
    setAssignments(userAssignments)
    setLoading(false)
  }, [user])

  // Generate calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  // Get assignments for a specific day
  const getAssignmentsForDay = (day) => {
    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate)
      return isSameDay(dueDate, day)
    })
  }

  // Get assignments for selected date
  const selectedDateAssignments = selectedDate 
    ? getAssignmentsForDay(selectedDate) 
    : []

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-amber-500'
      default: return 'bg-gray-400'
    }
  }

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View all your assignments by date
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2" padding="none">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dayAssignments = getAssignmentsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const hasOverdue = dayAssignments.some(a => 
                  a.status !== 'completed' && new Date(a.dueDate) < new Date()
                )

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-[80px] p-2 rounded-lg text-left transition-all
                      ${!isCurrentMonth ? 'opacity-40' : ''}
                      ${isSelected 
                        ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                      ${isToday(day) && !isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''}
                    `}
                  >
                    <span className={`
                      text-sm font-medium
                      ${isToday(day) 
                        ? 'w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center' 
                        : 'text-gray-700 dark:text-gray-300'
                      }
                    `}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Assignment indicators */}
                    {dayAssignments.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {dayAssignments.slice(0, 2).map(assignment => (
                          <div
                            key={assignment.id}
                            className={`
                              text-xs truncate px-1 py-0.5 rounded
                              ${assignment.status === 'completed' 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : hasOverdue 
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }
                            `}
                          >
                            {assignment.title}
                          </div>
                        ))}
                        {dayAssignments.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{dayAssignments.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Selected Day Details */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            {selectedDate 
              ? format(selectedDate, 'EEEE, MMMM d') 
              : 'Select a date'
            }
          </h3>

          {selectedDate ? (
            selectedDateAssignments.length > 0 ? (
              <div className="space-y-3">
                {selectedDateAssignments.map(assignment => (
                  <Link
                    key={assignment.id}
                    to={`/assignments/${assignment.id}`}
                    className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {assignment.className}
                        </p>
                      </div>
                      <Badge
                        size="small"
                        variant={
                          assignment.status === 'completed' ? 'success' :
                          assignment.status === 'in-progress' ? 'warning' :
                          'default'
                        }
                      >
                        {assignment.status === 'completed' ? 'Done' :
                         assignment.status === 'in-progress' ? 'Working' :
                         'To Do'}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No assignments due on this date
              </p>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Click on a date to see assignments
            </p>
          )}
        </Card>
      </div>

      {/* Legend */}
      <Card padding="small">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Legend:</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-500"></span>
            <span className="text-gray-600 dark:text-gray-400">To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span className="text-gray-600 dark:text-gray-400">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-green-500"></span>
            <span className="text-gray-600 dark:text-gray-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-red-500"></span>
            <span className="text-gray-600 dark:text-gray-400">Overdue</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Calendar
