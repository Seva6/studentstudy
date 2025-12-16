import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Button from '../components/common/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="inline-block mt-6">
          <Button icon={Home}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
