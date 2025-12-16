import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClass } from '../services/localStorage'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Textarea from '../components/common/Textarea'
import Card from '../components/common/Card'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const NewClass = () => {
  const navigate = useNavigate()
  const { user, userData, isTeacher } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    color: 'bg-blue-500'
  })
  const [errors, setErrors] = useState({})

  // Redirect non-teachers
  if (!isTeacher) {
    navigate('/classes')
    return null
  }

  const colors = [
    { value: 'bg-blue-500', label: '🔵 Blue' },
    { value: 'bg-green-500', label: '🟢 Green' },
    { value: 'bg-purple-500', label: '🟣 Purple' },
    { value: 'bg-orange-500', label: '🟠 Orange' },
    { value: 'bg-pink-500', label: '🩷 Pink' },
    { value: 'bg-teal-500', label: '🩵 Teal' },
    { value: 'bg-indigo-500', label: '💙 Indigo' },
    { value: 'bg-red-500', label: '🔴 Red' },
  ]

  const subjects = [
    { value: 'Math', label: 'Math' },
    { value: 'Science', label: 'Science' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Art', label: 'Art' },
    { value: 'Music', label: 'Music' },
    { value: 'Physical Education', label: 'Physical Education' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Foreign Language', label: 'Foreign Language' },
    { value: 'Other', label: 'Other' },
  ]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Class name is required'
    if (!formData.subject) newErrors.subject = 'Subject is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      createClass({
        name: formData.name,
        subject: formData.subject,
        description: formData.description,
        color: formData.color,
        teacherId: user.id,
        teacherName: userData.fullName
      })

      toast.success('Class created!')
      navigate('/classes')
    } catch (error) {
      console.error('Error creating class:', error)
      toast.error('Failed to create class')
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
          Create New Class
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Class Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., AP Chemistry Period 3"
            error={errors.name}
            required
          />

          <Select
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            options={subjects}
            placeholder="Select a subject"
            error={errors.subject}
            required
          />

          <Textarea
            label="Description (optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add a description for your class..."
            rows={3}
          />

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class Color
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`
                    w-10 h-10 rounded-lg ${color.value} transition-all
                    ${formData.color === color.value 
                      ? 'ring-2 ring-offset-2 ring-gray-800 dark:ring-white scale-110' 
                      : 'hover:scale-105'
                    }
                  `}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview</p>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${formData.color} flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">
                  {formData.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formData.name || 'Class Name'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.subject || 'Subject'}
                </p>
              </div>
            </div>
          </div>

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
              Create Class
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NewClass
