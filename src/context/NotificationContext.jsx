import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getNotificationsByUser,
  createNotification as createNotificationStorage,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationStorage,
  clearAllNotifications
} from '../services/localStorage'
import { useAuth } from './AuthContext'

const NotificationContext = createContext({})

export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Load notifications when user changes
  const loadNotifications = useCallback(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    const userNotifications = getNotificationsByUser(user.id)
    setNotifications(userNotifications)
    setUnreadCount(userNotifications.filter(n => !n.isRead).length)
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // Create a notification
  const createNotification = useCallback((data) => {
    if (!user) return

    createNotificationStorage({
      userId: user.id,
      type: data.type || 'reminder',
      title: data.title,
      message: data.message,
      assignmentId: data.assignmentId || null,
      urgency: data.urgency || 'low'
    })

    loadNotifications()
  }, [user, loadNotifications])

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    markNotificationAsRead(notificationId)
    loadNotifications()
  }, [loadNotifications])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    if (!user) return
    markAllNotificationsAsRead(user.id)
    loadNotifications()
  }, [user, loadNotifications])

  // Delete notification
  const deleteNotification = useCallback((notificationId) => {
    deleteNotificationStorage(notificationId)
    loadNotifications()
  }, [loadNotifications])

  // Clear all notifications
  const clearAll = useCallback(() => {
    if (!user) return
    clearAllNotifications(user.id)
    loadNotifications()
  }, [user, loadNotifications])

  const value = {
    notifications,
    unreadCount,
    loading,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
