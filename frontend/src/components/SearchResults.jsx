import { formatCurrency, formatDate } from '../api/client'

export default function SearchResults({ results, query, error, onClear }) {
  const sheets = Array.isArray(results) ? results : []

  const totalResults = sheets.reduce((sum, sheet) => {
    const matches = Array.isArray(sheet?.matches) ? sheet.matches : []
    return sum + matches.length
  }, 0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suchergebnisse</h2>
          <p className="text-gray-600 mt-1">
            {totalResults} {totalResults === 1 ? 'Ergebnis' : 'Ergebnisse'} für "{query}" 
          </p>
        </div>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Suche zurücksetzen
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p className="font-medium">Suche fehlgeschlagen</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {totalResults === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Ergebnisse gefunden</h3>
          <p className="text-gray-600">Versuche es mit einem anderen Suchbegriff</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sheets.map((sheet, sheetIdx) => {
            const matches = Array.isArray(sheet?.matches) ? sheet.matches : []
            const sheetKey = sheet?.sheetId || sheet?.id || sheetIdx
            const sheetName = sheet?.sheetName || sheet?.name || 'Sheet'
            const offerUrl = sheet?.offerUrl || sheet?.inputUrl || ''

            return (
              <div key={sheetKey} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{sheetName}</h3>
                    {offerUrl ? (
                      <a
                        href={offerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        Sheet öffnen
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {matches.length} {matches.length === 1 ? 'Treffer' : 'Treffer'}
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {matches.map((match, idx) => (
                    <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{match.kundenname}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">{formatDate(match.datum)}</span>
                            {match.status ? (
                              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {match.status}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-gray-900">{formatCurrency(match.betrag)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
