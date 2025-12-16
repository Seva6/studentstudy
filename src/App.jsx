import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Assignments from './pages/Assignments'
import AssignmentDetails from './pages/AssignmentDetails'
import NewAssignment from './pages/NewAssignment'
import Grades from './pages/Grades'
import NewGrade from './pages/NewGrade'
import Calendar from './pages/Calendar'
import Classes from './pages/Classes'
import ClassDetails from './pages/ClassDetails'
import NewClass from './pages/NewClass'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Spinner from './components/common/Spinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="large" />
      </div>
    )
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="assignments/new" element={<NewAssignment />} />
          <Route path="assignments/:id" element={<AssignmentDetails />} />
          <Route path="grades" element={<Grades />} />
          <Route path="grades/new" element={<NewGrade />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="classes" element={<Classes />} />
          <Route path="classes/new" element={<NewClass />} />
          <Route path="classes/:id" element={<ClassDetails />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
