import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Card from '../components/common/Card'
import Toggle from '../components/common/Toggle'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { User, Moon, Bell, Shield, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { userData, updateUserData, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    fullName: userData?.fullName || '',
    email: userData?.email || ''
  })

  const handleProfileUpdate = async () => {
    if (!profile.fullName.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    setLoading(true)
    try {
      await updateUserData({ fullName: profile.fullName })
      toast.success('Profile updated!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationToggle = async (enabled) => {
    try {
      await updateUserData({ 
        settings: { 
          ...userData?.settings,
          notificationsEnabled: enabled 
        } 
      })
      toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Profile</h2>
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={profile.fullName}
            onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
          />
          <Input
            label="Email"
            value={profile.email}
            disabled
            helperText="Email cannot be changed"
          />
          <Input
            label="Student/Teacher ID"
            value={userData?.schoolId || ''}
            disabled
            helperText="ID cannot be changed"
          />
          <Input
            label="Role"
            value={userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1) || ''}
            disabled
          />
          <Button 
            onClick={handleProfileUpdate} 
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Appearance Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
            <Moon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>

        <Toggle
          label="Dark Mode"
          description="Use dark theme across the app"
          enabled={darkMode}
          onChange={toggleDarkMode}
        />
      </Card>

      {/* Notifications Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          <Toggle
            label="Enable Notifications"
            description="Get reminders about upcoming deadlines"
            enabled={userData?.settings?.notificationsEnabled ?? true}
            onChange={handleNotificationToggle}
          />
        </div>
      </Card>

      {/* Account Section */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Account</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Account created: {new Date(userData?.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <Button
            variant="danger"
            icon={LogOut}
            onClick={logout}
            fullWidth
          >
            Sign Out
          </Button>
        </div>
      </Card>

      {/* App Info */}
      <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
        <p>StudentStudy v1.0.0</p>
        <p className="mt-1">Made with ❤️ for students</p>
      </div>
    </div>
  )
}

export default Settings
