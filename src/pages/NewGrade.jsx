import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGrade, getClassesByStudent } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Textarea from '../components/common/Textarea'
import Card from '../components/common/Card'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const NewGrade = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [formData, setFormData] = useState({
    assignmentName: '',
    classId: '',
    grade: '',
    dateReceived: new Date().toISOString().split('T')[0],
    notes: ''
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
    if (!formData.assignmentName.trim()) newErrors.assignmentName = 'Assignment name is required'
    if (!formData.grade) {
      newErrors.grade = 'Grade is required'
    } else {
      const gradeNum = parseFloat(formData.grade)
      if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
        newErrors.grade = 'Grade must be between 0 and 100'
      }
    }
    if (!formData.dateReceived) newErrors.dateReceived = 'Date is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const selectedClass = classes.find(c => c.value === formData.classId)
      
      createGrade({
        studentId: user.id,
        assignmentName: formData.assignmentName,
        classId: formData.classId || null,
        className: selectedClass?.label || 'General',
        grade: parseFloat(formData.grade),
        dateReceived: new Date(formData.dateReceived).toISOString(),
        notes: formData.notes
      })

      toast.success('Grade added!')
      navigate('/grades')
    } catch (error) {
      console.error('Error adding grade:', error)
      toast.error('Failed to add grade')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
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
          Add Grade
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Assignment Name"
            name="assignmentName"
            value={formData.assignmentName}
            onChange={handleChange}
            placeholder="e.g., Math Test Chapter 5"
            error={errors.assignmentName}
            required
          />

          <Select
            label="Class/Subject"
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            options={[
              { value: '', label: 'General (No class)' },
              ...classes
            ]}
            placeholder="Select a class"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Grade (%)"
              name="grade"
              type="number"
              min="0"
              max="100"
              value={formData.grade}
              onChange={handleChange}
              placeholder="e.g., 85"
              error={errors.grade}
              required
            />
            <Input
              label="Date Received"
              name="dateReceived"
              type="date"
              value={formData.dateReceived}
              onChange={handleChange}
              error={errors.dateReceived}
              required
            />
          </div>

          <Textarea
            label="Notes (optional)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes about this grade..."
            rows={3}
          />

          {/* Preview */}
          {formData.grade && (
            <div className={`p-4 rounded-lg text-center ${
              parseFloat(formData.grade) >= 90 ? 'bg-green-100 dark:bg-green-900/30' :
              parseFloat(formData.grade) >= 80 ? 'bg-blue-100 dark:bg-blue-900/30' :
              parseFloat(formData.grade) >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
              parseFloat(formData.grade) >= 60 ? 'bg-orange-100 dark:bg-orange-900/30' :
              'bg-red-100 dark:bg-red-900/30'
            }`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">Grade Preview</p>
              <p className={`text-3xl font-bold ${
                parseFloat(formData.grade) >= 90 ? 'text-green-600 dark:text-green-400' :
                parseFloat(formData.grade) >= 80 ? 'text-blue-600 dark:text-blue-400' :
                parseFloat(formData.grade) >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                parseFloat(formData.grade) >= 60 ? 'text-orange-600 dark:text-orange-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {formData.grade}%
              </p>
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
              Add Grade
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NewGrade
