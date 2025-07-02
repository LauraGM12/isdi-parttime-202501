import React from 'react'

const NotificationModal = ({ 
  isVisible = false, 
  message = '', 
  title = '', 
  type = 'error', 
  onClose 
}) => {
  if (!isVisible) return null

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500/20',
          iconColor: 'text-green-400',
          gradientColor: 'from-green-500 to-green-600',
          buttonColor: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
          ringColor: 'focus:ring-green-500',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        }
      case 'warning':
        return {
          bgColor: 'bg-yellow-500/20',
          iconColor: 'text-yellow-400',
          gradientColor: 'from-yellow-500 to-yellow-600',
          buttonColor: 'from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800',
          ringColor: 'focus:ring-yellow-500',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        }
      case 'info':
        return {
          bgColor: 'bg-blue-500/20',
          iconColor: 'text-blue-400',
          gradientColor: 'from-blue-500 to-blue-600',
          buttonColor: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
          ringColor: 'focus:ring-blue-500',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      default:
        return {
          bgColor: 'bg-red-500/20',
          iconColor: 'text-red-400',
          gradientColor: 'from-red-500 to-red-600',
          buttonColor: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          ringColor: 'focus:ring-red-500',
          icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        }
    }
  }

  const styles = getTypeStyles(type)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 mr-4">
            <div className={`w-12 h-12 ${styles.bgColor} rounded-full flex items-center justify-center`}>
              <div className={styles.iconColor}>
                {styles.icon}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">
              {title || (type === 'error' ? 'Error' : type === 'success' ? 'Éxito' : type === 'warning' ? 'Advertencia' : 'Información')}
            </h3>
            <div className={`w-16 h-1 bg-gradient-to-r ${styles.gradientColor} rounded-full`}></div>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`bg-gradient-to-r ${styles.buttonColor} text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 ${styles.ringColor} focus:ring-offset-2 focus:ring-offset-gray-800`}
          >
            <span className="flex items-center">
              <span className="mr-2">✕</span>
              Cerrar
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationModal