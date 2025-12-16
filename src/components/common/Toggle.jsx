const Toggle = ({ enabled, onChange, label, description, disabled = false }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        {label && (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </span>
        )}
        {description && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${enabled ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}
        `}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full 
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  )
}

export default Toggle
