 function ErrorState({
  title = 'Something went wrong',
  message = 'We had trouble loading this page. Please try again.',
  type = 'error',
  onRetry,
  statusCode,
  className = ''
}) {
  
  const icons = {
    error: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
        <path d="M12 8v4M12 16h.01" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    warning: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeWidth="1.5" />
        <path d="M12 9v4M12 17h.01" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    notFound: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="1.5" />
        <polyline points="9 22 9 12 15 12 15 22" strokeWidth="1.5" />
        <path d="M9 9h.01M15 9h.01" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    server: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" strokeWidth="1.5" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" strokeWidth="1.5" />
        <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    network: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
        <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1.5" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="1.5" />
      </svg>
    )
  };

  const getIcon = () => {
    if (statusCode === 404 || type === 'notFound') return icons.notFound;
    if (statusCode >= 500 || type === 'server') return icons.server;
    if (type === 'network') return icons.network;
    if (type === 'warning') return icons.warning;
    return icons.error;
  };

  return (
    <div className={`flex items-center justify-center min-h-[400px] p-8 ${className}`}>
      <div className="max-w-md w-full text-center">
        
        {/* Icon */}
        <div className="inline-flex items-center justify-center mb-6 text-slate-500">
          {getIcon()}
        </div>

        {/* Status Code */}
        {statusCode && (
          <div className="text-6xl font-light text-slate-700 mb-2 tracking-tight">
            {statusCode}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-semibold text-slate-200 mb-3">
          {title}
        </h1>

        {/* Message */}
        <p className="text-base text-slate-400 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors duration-150 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try again
            </button>
          )}
          
          {/* <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-slate-700 hover:border-slate-600 bg-transparent hover:bg-slate-800/50 text-slate-300 text-sm font-medium transition-all duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to homepage
          </a>
            */}
        </div> 

        {/* Help Text */}
        <p className="mt-8 text-sm text-slate-500">
          If this problem persists, please{' '}
          <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">
            contact support
          </a>
        </p>

      </div>
    </div>
  );
}

export default ErrorState;
