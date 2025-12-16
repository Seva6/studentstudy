import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { getGradesByUser } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { BarChart3 } from 'lucide-react'

const Grades = () => {
  const { user } = useAuth()
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Load grades from localStorage
    const userGrades = getGradesByUser(user.id)
    // Sort by date received (newest first)
    userGrades.sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived))
    setGrades(userGrades)
    setLoading(false)
  }, [user])

  // Calculate stats
  const averageGrade = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length)
    : null

  // Group grades by subject
  const gradesBySubject = grades.reduce((acc, grade) => {
    const subject = grade.className || 'General'
    if (!acc[subject]) {
      acc[subject] = []
    }
    acc[subject].push(grade)
    return acc
  }, {})

  // Calculate subject averages
  const subjectAverages = Object.entries(gradesBySubject).map(([subject, subjectGrades]) => ({
    subject,
    average: Math.round(subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length),
    count: subjectGrades.length
  })).sort((a, b) => b.average - a.average)

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 dark:text-green-400'
    if (grade >= 80) return 'text-blue-600 dark:text-blue-400'
    if (grade >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (grade >= 60) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getGradeBg = (grade) => {
    if (grade >= 90) return 'bg-green-100 dark:bg-green-900/30'
    if (grade >= 80) return 'bg-blue-100 dark:bg-blue-900/30'
    if (grade >= 70) return 'bg-yellow-100 dark:bg-yellow-900/30'
    if (grade >= 60) return 'bg-orange-100 dark:bg-orange-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

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
            Grades
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your academic performance
          </p>
        </div>
        <Link to="/grades/new">
          <Button icon={Plus}>Add Grade</Button>
        </Link>
      </div>

      {grades.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No grades yet"
          description="Start tracking your grades to see your performance"
          action={
            <Link to="/grades/new">
              <Button icon={Plus}>Add Grade</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Overall Average */}
          <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100">Overall Average</p>
                <p className="text-4xl font-bold mt-1">{averageGrade}%</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </Card>

          {/* Subject Averages */}
          <Card>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              By Subject
            </h2>
            <div className="space-y-3">
              {subjectAverages.map(({ subject, average, count }) => (
                <div key={subject} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {subject}
                      </span>
                      <span className={`text-sm font-bold ${getGradeColor(average)}`}>
                        {average}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          average >= 90 ? 'bg-green-500' :
                          average >= 80 ? 'bg-blue-500' :
                          average >= 70 ? 'bg-yellow-500' :
                          average >= 60 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${average}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {count} grade{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Grades */}
          <Card>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Recent Grades
            </h2>
            <div className="space-y-3">
              {grades.slice(0, 10).map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {grade.assignmentName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {grade.className} • {new Date(grade.dateReceived).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg font-bold ${getGradeBg(grade.grade)} ${getGradeColor(grade.grade)}`}>
                    {grade.grade}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default Grades
