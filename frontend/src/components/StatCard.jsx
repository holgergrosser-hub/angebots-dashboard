export default function StatCard({ title, value, icon, highlight = false }) {
  return (
    <div className={`rounded-lg p-6 ${
      highlight 
        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg' 
        : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${highlight ? 'text-primary-100' : 'text-gray-600'}`}>
          {title}
        </span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </div>
    </div>
  )
}
