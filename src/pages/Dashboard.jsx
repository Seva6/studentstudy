import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Plus,
  AlertTriangle,
  ChevronRight 
} from 'lucide-react'
import { getAssignmentsByUser, getGradesByUser } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Spinner from '../components/common/Spinner'
import AssignmentCard from '../components/assignments/AssignmentCard'
import { isOverdue, isDueSoon, formatDueDate } from '../utils/dateUtils'

const Dashboard = () => {
  const { user, userData, isTeacher } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Load assignments from localStorage
    const userAssignments = getAssignmentsByUser(user.id)
    // Sort by due date
    userAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    setAssignments(userAssignments)

    // Load grades for students
    if (!isTeacher) {
      const userGrades = getGradesByUser(user.id)
      setGrades(userGrades)
    }

    setLoading(false)
  }, [user, isTeacher])

  // Handle status change from AssignmentCard
  const handleStatusChange = (assignmentId, newStatus) => {
    setAssignments(prev => 
      prev.map(a => 
        a.id === assignmentId ? { ...a, status: newStatus } : a
      )
    )
  }

  // Calculate stats
  const activeAssignments = assignments.filter(a => a.status !== 'completed')
  const overdueAssignments = assignments.filter(a => 
    a.status !== 'completed' && isOverdue(a.dueDate)
  )
  const dueSoonAssignments = assignments.filter(a => 
    a.status !== 'completed' && !isOverdue(a.dueDate) && isDueSoon(a.dueDate)
  )
  const completedAssignments = assignments.filter(a => a.status === 'completed')
  
  const averageGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length)
    : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userData?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your assignments
          </p>
        </div>
        <Link to="/assignments/new">
          <Button icon={Plus}>
            Add Assignment
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="medium" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeAssignments.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          </div>
        </Card>

        <Card padding="medium" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {dueSoonAssignments.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Due Soon</p>
          </div>
        </Card>

        <Card padding="medium" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedAssignments.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          </div>
        </Card>

        {!isTeacher && (
          <Card padding="medium" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageGrade !== null ? `${averageGrade}%` : '-'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Grade</p>
            </div>
          </Card>
        )}
      </div>

      {/* Overdue Section */}
      {overdueAssignments.length > 0 && (
        <Card padding="none" className="border-red-200 dark:border-red-900">
          <div className="p-4 border-b border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="font-semibold text-red-700 dark:text-red-400">
                Overdue ({overdueAssignments.length})
              </h2>
            </div>
            <Link to="/assignments?filter=overdue" className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {overdueAssignments.slice(0, 3).map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} compact onStatusChange={handleStatusChange} />
            ))}
          </div>
        </Card>
      )}

      {/* Due This Week Section */}
      <Card padding="none">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            📅 Due This Week
          </h2>
          <Link to="/assignments" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-4">
          {dueSoonAssignments.length > 0 ? (
            <div className="space-y-3">
              {dueSoonAssignments.slice(0, 5).map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} onStatusChange={handleStatusChange} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>🎉 No assignments due soon!</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Add */}
      <Link to="/assignments/new">
        <Card hover className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-transparent">
          <div className="flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
            <Plus className="w-5 h-5" />
            <span>Quick Add Assignment</span>
          </div>
        </Card>
      </Link>
    </div>
  )
}

export default Dashboard
