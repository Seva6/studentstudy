import { createContext, useContext, useState, useEffect } from 'react'
import {
  getUserByEmail,
  createUser,
  updateUser,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  seedDemoData
} from '../services/localStorage'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
      setUserData(savedUser)
    }
    setLoading(false)
  }, [])

  const register = async (email, password, fullName, schoolId, role) => {
    // Check if email already exists
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      throw new Error('An account with this email already exists')
    }

    // Create new user
    const newUser = createUser({
      email,
      password,
      fullName,
      schoolId,
      role
    })

    // Add demo data for new users
    seedDemoData(newUser.id, role)

    // Set as current user
    setCurrentUser(newUser)
    setUser(newUser)
    setUserData(newUser)

    return newUser
  }

  const login = async (email, password) => {
    const foundUser = getUserByEmail(email)
    
    if (!foundUser) {
      throw new Error('No account found with this email')
    }

    if (foundUser.password !== password) {
      throw new Error('Incorrect password')
    }

    // Set as current user
    setCurrentUser(foundUser)
    setUser(foundUser)
    setUserData(foundUser)

    return foundUser
  }

  const logout = async () => {
    clearCurrentUser()
    setUser(null)
    setUserData(null)
  }

  const updateUserData = async (updates) => {
    if (!user) return

    const updatedUser = updateUser(user.id, updates)
    if (updatedUser) {
      setCurrentUser(updatedUser)
      setUserData(updatedUser)
    }
  }

  const value = {
    user,
    userData,
    loading,
    register,
    login,
    logout,
    updateUserData,
    isStudent: userData?.role === 'student',
    isTeacher: userData?.role === 'teacher'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
