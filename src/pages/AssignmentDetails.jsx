import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAssignmentById, updateAssignment, deleteAssignment } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Spinner from '../components/common/Spinner'
import Modal from '../components/common/Modal'
import { ArrowLeft, Edit, Trash2, Calendar, Clock, BookOpen } from 'lucide-react'
import { formatDueDateWithTime, isOverdue, getUrgency } from '../utils/dateUtils'
import toast from 'react-hot-toast'

const statusConfig = {
  'not-started': { label: 'Not Started', variant: 'default' },
  'in-progress': { label: 'In Progress', variant: 'warning' },
  'completed': { label: 'Completed', variant: 'success' }
}

const AssignmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchAssignment = () => {
      try {
        const data = getAssignmentById(id)
        
        if (data) {
          setAssignment(data)
        } else {
          toast.error('Assignment not found')
          navigate('/assignments')
        }
      } catch (error) {
        console.error('Error fetching assignment:', error)
        toast.error('Failed to load assignment')
      } finally {
        setLoading(false)
      }
    }

    fetchAssignment()
  }, [id, navigate])

  const handleStatusChange = (newStatus) => {
    try {
      updateAssignment(id, { status: newStatus })
      setAssignment(prev => ({ ...prev, status: newStatus }))
      toast.success(`Status updated to ${statusConfig[newStatus].label}`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = () => {
    setDeleting(true)
    try {
      deleteAssignment(id)
      toast.success('Assignment deleted')
      navigate('/assignments')
    } catch (error) {
      console.error('Error deleting assignment:', error)
      toast.error('Failed to delete assignment')
    } finally {
      setDeleting(false)
    }
  }

  const handleMilestoneStatusChange = (milestoneId, newStatus) => {
    const updatedMilestones = assignment.milestones.map(m =>
      m.id === milestoneId ? { ...m, status: newStatus } : m
    )

    try {
      updateAssignment(id, { milestones: updatedMilestones })
      setAssignment(prev => ({ ...prev, milestones: updatedMilestones }))
      toast.success('Milestone updated')
    } catch (error) {
      console.error('Error updating milestone:', error)
      toast.error('Failed to update milestone')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="large" />
      </div>
    )
  }

  if (!assignment) return null

  const overdue = isOverdue(assignment.dueDate) && assignment.status !== 'completed'
  const urgency = getUrgency(assignment.dueDate)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {assignment.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {assignment.className}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={Edit}
            onClick={() => navigate(`/assignments/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Card */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Status</h2>
            <Badge variant={overdue ? 'danger' : statusConfig[assignment.status]?.variant}>
              {overdue ? 'Overdue' : statusConfig[assignment.status]?.label}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            {['not-started', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`
                  flex-1 py-3 px-4 rounded-lg border-2 transition-all text-center
                  ${assignment.status === status
                    ? status === 'not-started' ? 'border-gray-400 bg-gray-100 dark:bg-gray-700' :
                      status === 'in-progress' ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' :
                      'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {statusConfig[status].label}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Details Card */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                <p className={`font-medium ${overdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {formatDueDateWithTime(assignment.dueDate, assignment.dueTime)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {assignment.subject}
                </p>
              </div>
            </div>

            {assignment.description && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</p>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {assignment.description}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Milestones Card (for projects) */}
        {assignment.type === 'project' && assignment.milestones?.length > 0 && (
          <Card>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Milestones</h2>
            <div className="space-y-3">
              {assignment.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {['not-started', 'in-progress', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleMilestoneStatusChange(milestone.id, status)}
                        className={`
                          w-6 h-6 rounded-full border-2 transition-all
                          ${milestone.status === status
                            ? status === 'not-started' ? 'bg-gray-400 border-gray-400' :
                              status === 'in-progress' ? 'bg-amber-400 border-amber-400' :
                              'bg-green-500 border-green-500'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }
                        `}
                        title={statusConfig[status].label}
                      >
                        {milestone.status === status && (
                          <span className="flex items-center justify-center text-white text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Assignment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete "{assignment.title}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

export default AssignmentDetails
