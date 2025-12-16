// Local Storage Service - Replaces Firebase
// All data is stored locally in the browser

const STORAGE_KEYS = {
  USERS: 'studentstudy_users',
  CURRENT_USER: 'studentstudy_current_user',
  ASSIGNMENTS: 'studentstudy_assignments',
  GRADES: 'studentstudy_grades',
  CLASSES: 'studentstudy_classes',
  NOTIFICATIONS: 'studentstudy_notifications'
}

// Helper to generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Generic storage functions
const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error reading from localStorage:`, error)
    return null
  }
}

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error saving to localStorage:`, error)
    return false
  }
}

// USER FUNCTIONS
export const getUsers = () => getFromStorage(STORAGE_KEYS.USERS) || []

export const getUserByEmail = (email) => {
  const users = getUsers()
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export const getUserById = (id) => {
  const users = getUsers()
  return users.find(u => u.id === id)
}

export const createUser = (userData) => {
  const users = getUsers()
  const newUser = {
    id: generateId(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      darkMode: false,
      notificationsEnabled: true
    },
    classes: []
  }
  users.push(newUser)
  saveToStorage(STORAGE_KEYS.USERS, users)
  return newUser
}

export const updateUser = (userId, updates) => {
  const users = getUsers()
  const index = users.findIndex(u => u.id === userId)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.USERS, users)
    return users[index]
  }
  return null
}

// CURRENT USER (Session)
export const getCurrentUser = () => getFromStorage(STORAGE_KEYS.CURRENT_USER)

export const setCurrentUser = (user) => saveToStorage(STORAGE_KEYS.CURRENT_USER, user)

export const clearCurrentUser = () => localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)

// ASSIGNMENTS FUNCTIONS
export const getAssignments = () => getFromStorage(STORAGE_KEYS.ASSIGNMENTS) || []

export const getAssignmentsByUser = (userId) => {
  const assignments = getAssignments()
  return assignments.filter(a => a.studentId === userId)
}

export const getAssignmentById = (id) => {
  const assignments = getAssignments()
  return assignments.find(a => a.id === id)
}

export const getAssignmentsByClass = (classId) => {
  const assignments = getAssignments()
  return assignments.filter(a => a.classId === classId)
}

export const createAssignment = (assignmentData) => {
  const assignments = getAssignments()
  const newAssignment = {
    id: generateId(),
    ...assignmentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  assignments.push(newAssignment)
  saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments)
  return newAssignment
}

export const updateAssignment = (assignmentId, updates) => {
  const assignments = getAssignments()
  const index = assignments.findIndex(a => a.id === assignmentId)
  if (index !== -1) {
    assignments[index] = { ...assignments[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments)
    return assignments[index]
  }
  return null
}

export const deleteAssignment = (assignmentId) => {
  const assignments = getAssignments()
  const filtered = assignments.filter(a => a.id !== assignmentId)
  saveToStorage(STORAGE_KEYS.ASSIGNMENTS, filtered)
  return true
}

// GRADES FUNCTIONS
export const getGrades = () => getFromStorage(STORAGE_KEYS.GRADES) || []

export const getGradesByUser = (userId) => {
  const grades = getGrades()
  return grades.filter(g => g.studentId === userId)
}

export const createGrade = (gradeData) => {
  const grades = getGrades()
  const newGrade = {
    id: generateId(),
    ...gradeData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  grades.push(newGrade)
  saveToStorage(STORAGE_KEYS.GRADES, grades)
  return newGrade
}

export const updateGrade = (gradeId, updates) => {
  const grades = getGrades()
  const index = grades.findIndex(g => g.id === gradeId)
  if (index !== -1) {
    grades[index] = { ...grades[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.GRADES, grades)
    return grades[index]
  }
  return null
}

export const deleteGrade = (gradeId) => {
  const grades = getGrades()
  const filtered = grades.filter(g => g.id !== gradeId)
  saveToStorage(STORAGE_KEYS.GRADES, filtered)
  return true
}

// CLASSES FUNCTIONS
export const getClasses = () => getFromStorage(STORAGE_KEYS.CLASSES) || []

export const getClassById = (id) => {
  const classes = getClasses()
  return classes.find(c => c.id === id)
}

export const getClassesByTeacher = (teacherId) => {
  const classes = getClasses()
  return classes.filter(c => c.teacherId === teacherId)
}

export const getClassesByStudent = (studentId) => {
  const classes = getClasses()
  return classes.filter(c => c.studentIds?.includes(studentId))
}

export const createClass = (classData) => {
  const classes = getClasses()
  const newClass = {
    id: generateId(),
    ...classData,
    studentIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  classes.push(newClass)
  saveToStorage(STORAGE_KEYS.CLASSES, classes)
  return newClass
}

export const updateClass = (classId, updates) => {
  const classes = getClasses()
  const index = classes.findIndex(c => c.id === classId)
  if (index !== -1) {
    classes[index] = { ...classes[index], ...updates, updatedAt: new Date().toISOString() }
    saveToStorage(STORAGE_KEYS.CLASSES, classes)
    return classes[index]
  }
  return null
}

export const deleteClass = (classId) => {
  const classes = getClasses()
  const filtered = classes.filter(c => c.id !== classId)
  saveToStorage(STORAGE_KEYS.CLASSES, filtered)
  return true
}

// NOTIFICATIONS FUNCTIONS
export const getNotifications = () => getFromStorage(STORAGE_KEYS.NOTIFICATIONS) || []

export const getNotificationsByUser = (userId) => {
  const notifications = getNotifications()
  return notifications.filter(n => n.userId === userId).sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )
}

export const createNotification = (notificationData) => {
  const notifications = getNotifications()
  const newNotification = {
    id: generateId(),
    ...notificationData,
    isRead: false,
    createdAt: new Date().toISOString()
  }
  notifications.push(newNotification)
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
  return newNotification
}

export const markNotificationAsRead = (notificationId) => {
  const notifications = getNotifications()
  const index = notifications.findIndex(n => n.id === notificationId)
  if (index !== -1) {
    notifications[index].isRead = true
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return notifications[index]
  }
  return null
}

export const markAllNotificationsAsRead = (userId) => {
  const notifications = getNotifications()
  notifications.forEach(n => {
    if (n.userId === userId) n.isRead = true
  })
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
}

export const deleteNotification = (notificationId) => {
  const notifications = getNotifications()
  const filtered = notifications.filter(n => n.id !== notificationId)
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, filtered)
  return true
}

export const clearAllNotifications = (userId) => {
  const notifications = getNotifications()
  const filtered = notifications.filter(n => n.userId !== userId)
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, filtered)
  return true
}

// SEED DATA - Demo data for first-time users
export const seedDemoData = (userId, userRole) => {
  // Add some demo assignments
  const demoAssignments = [
    {
      title: 'Math Homework - Chapter 5',
      description: 'Complete exercises 1-20 on page 142',
      classId: null,
      className: 'Mathematics',
      subject: 'Math',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      dueTime: '23:59',
      type: 'daily',
      status: 'not-started',
      studentId: userId,
      createdBy: { id: userId, role: userRole, name: 'You' }
    },
    {
      title: 'Science Lab Report',
      description: 'Write a report on the photosynthesis experiment',
      classId: null,
      className: 'Science',
      subject: 'Science',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      dueTime: '23:59',
      type: 'project',
      status: 'in-progress',
      studentId: userId,
      createdBy: { id: userId, role: userRole, name: 'You' },
      milestones: [
        { id: 'ms1', title: 'Research', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'completed' },
        { id: 'ms2', title: 'First Draft', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'in-progress' },
        { id: 'ms3', title: 'Final Draft', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'not-started' }
      ]
    },
    {
      title: 'English Essay',
      description: 'Compare and contrast essay on two novels',
      classId: null,
      className: 'English',
      subject: 'English',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue!)
      dueTime: '23:59',
      type: 'daily',
      status: 'not-started',
      studentId: userId,
      createdBy: { id: userId, role: userRole, name: 'You' }
    }
  ]

  demoAssignments.forEach(a => createAssignment(a))

  // Add some demo grades
  const demoGrades = [
    { assignmentName: 'Quiz 1', className: 'Mathematics', grade: 92, dateReceived: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), studentId: userId },
    { assignmentName: 'Test Chapter 4', className: 'Mathematics', grade: 85, dateReceived: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), studentId: userId },
    { assignmentName: 'Lab Report 1', className: 'Science', grade: 88, dateReceived: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), studentId: userId },
    { assignmentName: 'Essay Draft', className: 'English', grade: 78, dateReceived: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), studentId: userId }
  ]

  demoGrades.forEach(g => createGrade(g))

  // Add a welcome notification
  createNotification({
    userId: userId,
    type: 'system',
    title: 'Welcome to StudentStudy! 🎉',
    message: 'Your account is ready. Start by adding your assignments and tracking your progress!',
    urgency: 'low'
  })
}
