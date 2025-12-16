import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  getClassById, 
  updateClass, 
  getAssignmentsByClass,
  getUsers
} from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import Modal from '../components/common/Modal'
import { ArrowLeft, Plus, UserPlus, Trash2, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const ClassDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isTeacher } = useAuth()
  const [classData, setClassData] = useState(null)
  const [students, setStudents] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [addStudentModal, setAddStudentModal] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const fetchClassData = () => {
      try {
        // Fetch class
        const data = getClassById(id)
        if (!data) {
          toast.error('Class not found')
          navigate('/classes')
          return
        }
        
        setClassData(data)

        // Fetch students
        if (data.studentIds?.length > 0) {
          const allUsers = getUsers()
          const studentsData = allUsers.filter(u => 
            data.studentIds.includes(u.schoolId) && u.role === 'student'
          )
          setStudents(studentsData)
        }

        // Fetch class assignments
        const classAssignments = getAssignmentsByClass(id)
        setAssignments(classAssignments)

      } catch (error) {
        console.error('Error fetching class:', error)
        toast.error('Failed to load class')
      } finally {
        setLoading(false)
      }
    }

    fetchClassData()
  }, [id, navigate])

  const handleAddStudent = () => {
    if (!studentId.trim()) {
      toast.error('Please enter a student ID')
      return
    }

    setAdding(true)
    try {
      // Find student by school ID
      const allUsers = getUsers()
      const studentData = allUsers.find(u => 
        u.schoolId === studentId.trim() && u.role === 'student'
      )

      if (!studentData) {
        toast.error('Student not found with that ID')
        setAdding(false)
        return
      }

      // Check if already in class
      if (classData.studentIds?.includes(studentId.trim())) {
        toast.error('Student is already in this class')
        setAdding(false)
        return
      }

      // Add student to class
      const updatedStudentIds = [...(classData.studentIds || []), studentId.trim()]
      updateClass(id, { studentIds: updatedStudentIds })

      // Update local state
      setClassData(prev => ({ ...prev, studentIds: updatedStudentIds }))
      setStudents(prev => [...prev, studentData])
      
      toast.success('Student added to class!')
      setAddStudentModal(false)
      setStudentId('')
    } catch (error) {
      console.error('Error adding student:', error)
      toast.error('Failed to add student')
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveStudent = (studentSchoolId, studentUserId) => {
    try {
      // Remove from class
      const updatedStudentIds = classData.studentIds.filter(sid => sid !== studentSchoolId)
      updateClass(id, { studentIds: updatedStudentIds })

      // Update local state
      setClassData(prev => ({ ...prev, studentIds: updatedStudentIds }))
      setStudents(prev => prev.filter(s => s.id !== studentUserId))
      
      toast.success('Student removed from class')
    } catch (error) {
      console.error('Error removing student:', error)
      toast.error('Failed to remove student')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="large" />
      </div>
    )
  }

  if (!classData) return null

  const isOwner = classData.teacherId === user?.uid

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${classData.color || 'bg-blue-500'} flex items-center justify-center`}>
              <span className="text-white font-bold text-2xl">
                {classData.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {classData.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {classData.subject} • {classData.studentIds?.length || 0} students
              </p>
            </div>
          </div>
        </div>
        {isOwner && (
          <Button icon={UserPlus} onClick={() => setAddStudentModal(true)}>
            Add Student
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Students */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Students ({students.length})
          </h2>
          {students.length > 0 ? (
            <div className="space-y-3">
              {students.map(student => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-medium">
                        {student.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {student.fullName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {student.schoolId}
                      </p>
                    </div>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveStudent(student.schoolId, student.id)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No students in this class yet
            </p>
          )}
        </Card>

        {/* Class Info */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Class Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Teacher</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {classData.teacherName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {classData.subject}
              </p>
            </div>
            {classData.description && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {classData.description}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Assignments</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {assignments.length} total
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Assignments */}
      {assignments.length > 0 && (
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Recent Assignments
          </h2>
          <div className="space-y-3">
            {assignments.slice(0, 5).map(assignment => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={addStudentModal}
        onClose={() => setAddStudentModal(false)}
        title="Add Student to Class"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddStudentModal(false)}>
              Cancel
            </Button>
            <Button loading={adding} onClick={handleAddStudent}>
              Add Student
            </Button>
          </>
        }
      >
        <Input
          label="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter student's school ID"
          helperText="Enter the student's ID number (e.g., STU12345)"
        />
      </Modal>
    </div>
  )
}

export default ClassDetails
