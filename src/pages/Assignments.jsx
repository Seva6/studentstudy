import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Filter } from 'lucide-react'
import { getAssignmentsByUser } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import AssignmentCard from '../components/assignments/AssignmentCard'
import { groupAssignmentsByDate } from '../utils/dateUtils'
import { BookOpen } from 'lucide-react'

const Assignments = () => {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('dueDate')

  useEffect(() => {
    if (!user) return

    // Load assignments from localStorage
    const userAssignments = getAssignmentsByUser(user.id)
    // Sort by due date
    userAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    setAssignments(userAssignments)
    setLoading(false)
  }, [user])

  const groupedAssignments = groupAssignmentsByDate(assignments)

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assignments
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all your homework and projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="subject">Sort by Subject</option>
            <option value="status">Sort by Status</option>
          </select>
          <Link to="/assignments/new">
            <Button icon={Plus}>New</Button>
          </Link>
        </div>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No assignments yet"
          description="Create your first assignment to start tracking your homework"
          action={
            <Link to="/assignments/new">
              <Button icon={Plus}>Add Assignment</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Overdue */}
          {groupedAssignments.overdue.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Overdue ({groupedAssignments.overdue.length})
              </h2>
              <div className="space-y-3">
                {groupedAssignments.overdue.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </section>
          )}

          {/* Today */}
          {groupedAssignments.today.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Today ({groupedAssignments.today.length})
              </h2>
              <div className="space-y-3">
                {groupedAssignments.today.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </section>
          )}

          {/* Tomorrow */}
          {groupedAssignments.tomorrow.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Tomorrow ({groupedAssignments.tomorrow.length})
              </h2>
              <div className="space-y-3">
                {groupedAssignments.tomorrow.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </section>
          )}

          {/* This Week */}
          {groupedAssignments.thisWeek.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                This Week ({groupedAssignments.thisWeek.length})
              </h2>
              <div className="space-y-3">
                {groupedAssignments.thisWeek.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </section>
          )}

          {/* Later */}
          {groupedAssignments.later.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Later ({groupedAssignments.later.length})
              </h2>
              <div className="space-y-3">
                {groupedAssignments.later.map(assignment => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

export default Assignments
