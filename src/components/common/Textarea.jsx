import { forwardRef } from 'react'

const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  required = false,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          block w-full rounded-lg border transition-colors duration-200
          px-4 py-2.5
          bg-white dark:bg-gray-800
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
          }
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
          resize-none
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
