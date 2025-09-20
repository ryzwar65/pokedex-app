export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-blue-500`}></div>
      {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
    </div>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
      <div className="text-center">
        <div className="h-6 bg-gray-200 rounded mb-2 mx-auto w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 mx-auto w-1/2"></div>
        <div className="flex justify-center gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function PokemonDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
      </div>

      {/* Image and basic info skeleton */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="flex justify-center">
          <div className="w-80 h-80 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Stats chart skeleton */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}