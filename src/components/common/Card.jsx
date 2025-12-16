const Card = ({ 
  children, 
  className = '', 
  padding = 'medium',
  hover = false,
  onClick,
  ...props 
}) => {
  const paddingStyles = {
    none: '',
    small: 'p-3',
    medium: 'p-4 sm:p-6',
    large: 'p-6 sm:p-8',
  }

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl 
        border border-gray-200 dark:border-gray-700
        shadow-sm
        ${hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all duration-200' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
