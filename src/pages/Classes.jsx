import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { getClassesByTeacher, getClassesByStudent } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'

const Classes = () => {
  const { user, isTeacher } = useAuth()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Load classes based on role
    let userClasses
    if (isTeacher) {
      userClasses = getClassesByTeacher(user.id)
    } else {
      userClasses = getClassesByStudent(user.id)
    }
    setClasses(userClasses)
    setLoading(false)
  }, [user, isTeacher])

  // Predefined colors for classes
  const classColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
  ]

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
            Classes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isTeacher ? 'Manage your classes and students' : 'View your enrolled classes'}
          </p>
        </div>
        {isTeacher && (
          <Link to="/classes/new">
            <Button icon={Plus}>New Class</Button>
          </Link>
        )}
      </div>

      {classes.length === 0 ? (
        <EmptyState
          icon={Users}
          title={isTeacher ? "No classes yet" : "Not enrolled in any classes"}
          description={isTeacher 
            ? "Create your first class to start managing students and assignments"
            : "Your teacher will add you to a class"
          }
          action={isTeacher && (
            <Link to="/classes/new">
              <Button icon={Plus}>Create Class</Button>
            </Link>
          )}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem, index) => (
            <Link key={classItem.id} to={`/classes/${classItem.id}`}>
              <Card hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${classItem.color || classColors[index % classColors.length]} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-lg">
                      {classItem.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {classItem.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{classItem.studentIds?.length || 0} students</span>
                    </div>
                  </div>
                </div>
                {isTeacher && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    Teacher: {classItem.teacherName}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Classes
