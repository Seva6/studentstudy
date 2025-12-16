import { Bell, Check, Trash2, CheckCheck } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import Badge from '../components/common/Badge'
import { getRelativeTime } from '../utils/dateUtils'

const Notifications = () => {
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    clearAll 
  } = useNotifications()

  const getUrgencyStyle = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'border-l-red-500'
      case 'high': return 'border-l-orange-500'
      case 'medium': return 'border-l-yellow-500'
      default: return 'border-l-blue-500'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'overdue': return '⚠️'
      case 'reminder': return '🔔'
      case 'milestone': return '📌'
      case 'class': return '👥'
      default: return '📢'
    }
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
            Notifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Stay updated on your assignments
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="small"
              icon={CheckCheck}
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
            <Button 
              variant="ghost" 
              size="small"
              icon={Trash2}
              onClick={clearAll}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! Notifications will appear here when you have upcoming deadlines."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              padding="none"
              className={`
                border-l-4 ${getUrgencyStyle(notification.urgency)}
                ${!notification.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}
              `}
            >
              <div className="p-4 flex items-start gap-4">
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">
                  {getTypeIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {getRelativeTime(notification.createdAt)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
