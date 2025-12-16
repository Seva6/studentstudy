import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createAssignment, getClassesByStudent } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Textarea from '../components/common/Textarea'
import Card from '../components/common/Card'
import Toggle from '../components/common/Toggle'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateForInput } from '../utils/dateUtils'

const NewAssignment = () => {
  const navigate = useNavigate()
  const { user, userData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    description: '',
    dueDate: '',
    dueTime: '23:59',
    type: 'daily',
    milestones: [],
    recurrence: {
      pattern: 'weekly',
      daysOfWeek: [],
      endDate: ''
    }
  })
  const [errors, setErrors] = useState({})

  // Fetch user's classes
  useEffect(() => {
    if (!user) return
    
    const userClasses = getClassesByStudent(user.id)
    const classOptions = userClasses.map(c => ({
      value: c.id,
      label: c.name,
      ...c
    }))
    setClasses(classOptions)
  }, [user])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required'
    
    if (formData.type === 'project') {
      const invalidMilestones = formData.milestones.some(m => !m.title || !m.dueDate)
      if (invalidMilestones) newErrors.milestones = 'All milestones need a title and due date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const selectedClass = classes.find(c => c.value === formData.classId)
      
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        classId: formData.classId || null,
        className: selectedClass?.label || 'Personal',
        subject: selectedClass?.subject || 'General',
        dueDate: new Date(formData.dueDate).toISOString(),
        dueTime: formData.dueTime,
        type: formData.type,
        status: 'not-started',
        isOverdue: false,
        createdBy: {
          id: user.id,
          role: userData.role,
          name: userData.fullName
        },
        studentId: user.id
      }

      // Add milestones for projects
      if (formData.type === 'project' && formData.milestones.length > 0) {
        assignmentData.milestones = formData.milestones.map((m, index) => ({
          id: `milestone-${index}`,
          title: m.title,
          dueDate: new Date(m.dueDate).toISOString(),
          status: 'not-started'
        }))
      }

      // Add recurrence for recurring assignments
      if (formData.type === 'recurring') {
        assignmentData.recurrence = {
          pattern: formData.recurrence.pattern,
          daysOfWeek: formData.recurrence.daysOfWeek,
          endDate: formData.recurrence.endDate ? new Date(formData.recurrence.endDate).toISOString() : null
        }
      }

      createAssignment(assignmentData)
      toast.success('Assignment created!')
      navigate('/assignments')
    } catch (error) {
      console.error('Error creating assignment:', error)
      toast.error('Failed to create assignment')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', dueDate: '' }]
    }))
  }

  const updateMilestone = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => 
        i === index ? { ...m, [field]: value } : m
      )
    }))
  }

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          New Assignment
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assignment Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'daily', label: 'Daily', emoji: '📝' },
                { value: 'project', label: 'Project', emoji: '📊' },
                { value: 'recurring', label: 'Recurring', emoji: '🔄' }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-center
                    ${formData.type === type.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <span className="text-2xl">{type.emoji}</span>
                  <p className="text-sm font-medium mt-1 text-gray-700 dark:text-gray-300">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Math Homework Chapter 5"
            error={errors.title}
            required
          />

          <Select
            label="Class/Subject"
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Personal (No class)' },
              ...classes
            ]}
            placeholder="Select a class"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any notes or instructions..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              error={errors.dueDate}
              required
            />
            <Input
              label="Due Time"
              name="dueTime"
              type="time"
              value={formData.dueTime}
              onChange={handleChange}
            />
          </div>

          {/* Milestones for Projects */}
          {formData.type === 'project' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Milestones
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  icon={Plus}
                  onClick={addMilestone}
                >
                  Add
                </Button>
              </div>
              {errors.milestones && (
                <p className="text-sm text-red-500 mb-2">{errors.milestones}</p>
              )}
              <div className="space-y-3">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Milestone title"
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      />
                      <Input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.milestones.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No milestones yet. Add milestones to track progress on your project.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Recurrence for Recurring */}
          {formData.type === 'recurring' && (
            <div className="space-y-4">
              <Select
                label="Repeat Pattern"
                value={formData.recurrence.pattern}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  recurrence: { ...prev.recurrence, pattern: e.target.value }
                }))}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'biweekly', label: 'Every 2 weeks' },
                  { value: 'monthly', label: 'Monthly' }
                ]}
              />
              <Input
                label="End Date (optional)"
                type="date"
                value={formData.recurrence.endDate}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  recurrence: { ...prev.recurrence, endDate: e.target.value }
                }))}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              fullWidth
            >
              Create Assignment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NewAssignment
