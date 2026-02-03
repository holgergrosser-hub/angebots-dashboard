import { useState, useEffect, useRef } from 'react'
import SheetCard from './SheetCard'
import SheetDetail from './SheetDetail'

export default function Dashboard({ sheets }) {
  const [selectedSheet, setSelectedSheet] = useState(null)
  const detailRef = useRef(null)

  // Optional: open a sheet directly via URL (?sheet=...)
  useEffect(() => {
    const sheetId = new URLSearchParams(window.location.search).get('sheet')
    if (!sheetId) return
    const match = sheets.find(s => s.id === sheetId)
    if (match) setSelectedSheet(match)
  }, [sheets])

  useEffect(() => {
    if (!selectedSheet) return
    // scroll to evaluations so user immediately sees them
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }, [selectedSheet?.id])

  const openSheet = (sheet) => {
    setSelectedSheet(sheet)

    // keep URL in sync (handy for reload/share) but UI doesn't rely on it
    const url = new URL(window.location.href)
    url.searchParams.set('sheet', sheet.id)
    window.history.replaceState({}, '', url)
  }

  const closeSheet = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('sheet')
    window.history.replaceState({}, '', url)
    setSelectedSheet(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Alle Sheets</h2>
        <p className="text-gray-600 mt-1">
          Klicke auf ein Sheet für die Auswertung
        </p>
      </div>

      {sheets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Sheets konfiguriert</h3>
          <p className="text-gray-600">
            Bitte konfiguriere Sheets in der Apps Script Config.js Datei
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sheets.map(sheet => (
            <SheetCard
              key={sheet.id}
              sheet={sheet}
              onClick={() => openSheet(sheet)}
            />
          ))}
        </div>
      )}

      {/* Evaluations */}
      {selectedSheet && (
        <div ref={detailRef} className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Auswertung: {selectedSheet.name}
            </h3>
            <button
              onClick={closeSheet}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Schließen
            </button>
          </div>

          <SheetDetail sheet={selectedSheet} onBack={closeSheet} hideBack />
        </div>
      )}
    </div>
  )
}