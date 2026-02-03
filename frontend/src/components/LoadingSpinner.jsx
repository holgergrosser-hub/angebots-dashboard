export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600 mb-4"></div>
        <p className="text-gray-600">Lade Daten...</p>
      </div>
    </div>
  )
}
