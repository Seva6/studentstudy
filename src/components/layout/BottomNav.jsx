import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Calendar, BarChart3, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const BottomNav = () => {
  const { isStudent } = useAuth()

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Tasks', href: '/assignments', icon: BookOpen },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    ...(isStudent ? [{ name: 'Grades', href: '/grades', icon: BarChart3 }] : []),
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex items-center justify-around h-16">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => `
              flex flex-col items-center justify-center px-3 py-2 min-w-0
              ${isActive 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-gray-400'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1 truncate">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
