import { useState, useEffect } from 'react'
import { getSheetStats, formatCurrency, formatDate } from '../api/client'
import LoadingSpinner from './LoadingSpinner'
import StatCard from './StatCard'

export default function SheetDetail({ sheet, onBack, hideBack = false }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('heute')

  useEffect(() => {
    setActiveTab('heute')
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet.id])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getSheetStats(sheet.id)

      if (response?.success) {
        setStats(response.data || {})
      } else {
        throw new Error(response?.error || 'Fehler beim Laden der Statistiken')
      }
    } catch (err) {
      console.error('Fehler:', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        {!hideBack && (
          <button onClick={onBack} className="mb-6 flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            ZurÃ¼ck
          </button>
        )}
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {!hideBack && (
          <button onClick={onBack} className="mb-6 flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            ZurÃ¼ck
          </button>
        )}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button onClick={loadStats} className="mt-4 text-red-600 hover:text-red-700 font-medium">
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700">Keine Auswertungsdaten vorhanden.</p>
        <button
          onClick={loadStats}
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Neu laden
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'heute', label: 'Heute', data: stats.heute },
    { id: 'letzte7Tage', label: 'Letzte 7 Tage', data: stats.letzte7Tage },
    { id: 'letzte30Tage', label: 'Letzte 30 Tage', data: stats.letzte30Tage },
    { id: 'aktuellesJahr', label: 'Aktuelles Jahr', data: stats.aktuellesJahr },
    { id: 'letztesJahr', label: 'Letztes Jahr', data: stats.letztesJahr }
  ]

  const currentData = tabs.find(t => t.id === activeTab)?.data || { anzahl: 0, summe: 0, angebote: [] }

  return (
    <div>
      {!hideBack && (
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            ZurÃ¼ck zur Ãœbersicht
          </button>

          <button
            onClick={loadStats}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Aktualisieren"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <StatCard title="Anzahl Angebote" value={currentData.anzahl ?? 0} icon="ðŸ“Š" />
            <StatCard title="Gesamt-Summe" value={formatCurrency(currentData.summe ?? 0)} icon="ðŸ’°" highlight />
          </div>

          {activeTab === 'heute' && Array.isArray(currentData.angebote) && currentData.angebote.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Angebote von heute</h3>
              <div className="space-y-3">
                {currentData.angebote.map((angebot, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{angebot.kundenname}</p>
                        {angebot.status && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {angebot.status}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(angebot.betrag)}</p>
                        <p className="text-sm text-gray-500">{formatDate(angebot.datum)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'heute' && Array.isArray(currentData.angebote) && currentData.angebote.length === 0 && (
            <div className="text-center py-8 text-gray-500">Keine Angebote von heute</div>
          )}
        </div>
      </div>
    </div>
  )
}
