import React from   "react"

 function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* Header */}
      <div className="h-6 w-48 bg-gray-700 rounded" />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-28 bg-gray-800 rounded-lg"
          />
        ))}
      </div>

      {/* Table */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-4 bg-gray-700 rounded"
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingState;