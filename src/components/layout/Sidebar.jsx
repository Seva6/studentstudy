import { NavLink } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { isTeacher, isStudent } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Assignments', href: '/assignments', icon: BookOpen },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    ...(isStudent ? [{ name: 'Grades', href: '/grades', icon: BarChart3 }] : []),
    { name: 'Classes', href: '/classes', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${isActive 
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        }
      `}
    >
      <item.icon className="w-5 h-5" />
      <span>{item.name}</span>
    </NavLink>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          z-50 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:top-16 lg:z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            StudentStudy
          </span>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
