import { Link } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { formatDueDate, isOverdue, getUrgency } from '../../utils/dateUtils'
import Badge from '../common/Badge'
import toast from 'react-hot-toast'

const statusConfig = {
  'not-started': { label: 'Not Started', variant: 'default' },
  'in-progress': { label: 'In Progress', variant: 'warning' },
  'completed': { label: 'Completed', variant: 'success' }
}

const AssignmentCard = ({ assignment, compact = false }) => {
  const { id, title, className, subject, dueDate, status, type } = assignment
  const overdue = isOverdue(dueDate) && status !== 'completed'
  const urgency = getUrgency(dueDate)

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDoc(doc(db, 'assignments', id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      toast.success(`Status updated to ${statusConfig[newStatus].label}`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const urgencyBorder = {
    low: 'border-l-blue-400',
    medium: 'border-l-yellow-400',
    high: 'border-l-orange-400',
    urgent: 'border-l-red-500',
    overdue: 'border-l-red-600'
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
        border-l-4 ${urgencyBorder[overdue ? 'overdue' : urgency]}
        ${overdue ? 'animate-pulse-slow' : ''}
        hover:shadow-md transition-shadow
      `}
    >
      <Link to={`/assignments/${id}`} className="block p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {subject && (
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                  {subject}
                </span>
              )}
              {type === 'project' && (
                <Badge variant="info" size="small">Project</Badge>
              )}
              {type === 'recurring' && (
                <Badge variant="primary" size="small">Recurring</Badge>
              )}
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {title}
            </h3>
            {!compact && className && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {className}
              </p>
            )}
          </div>
          
          <div className="text-right flex-shrink-0">
            <p className={`text-sm font-medium ${overdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
              {formatDueDate(dueDate)}
            </p>
            <Badge 
              variant={overdue ? 'danger' : statusConfig[status]?.variant || 'default'} 
              size="small"
              className="mt-1"
            >
              {overdue && status !== 'completed' ? 'Overdue' : statusConfig[status]?.label}
            </Badge>
          </div>
        </div>
      </Link>
      
      {/* Status Toggle */}
      {!compact && (
        <div className="px-4 pb-4 flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Status:</span>
          {['not-started', 'in-progress', 'completed'].map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.preventDefault()
                handleStatusChange(s)
              }}
              className={`
                w-6 h-6 rounded-full border-2 transition-all
                ${status === s 
                  ? s === 'not-started' ? 'bg-gray-400 border-gray-400' :
                    s === 'in-progress' ? 'bg-amber-400 border-amber-400' :
                    'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }
              `}
              title={statusConfig[s].label}
            >
              {status === s && (
                <span className="flex items-center justify-center text-white text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AssignmentCard
