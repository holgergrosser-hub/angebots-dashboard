import { useState } from 'react'
import SheetCard from './SheetCard'
import SheetDetail from './SheetDetail'

export default function Dashboard({ sheets }) {
  const [selectedSheet, setSelectedSheet] = useState(null)

  if (selectedSheet) {
    return (
      <SheetDetail 
        sheet={selectedSheet} 
        onBack={() => setSelectedSheet(null)}
      />
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Alle Sheets</h2>
        <p className="text-gray-600 mt-1">
          Klicke auf ein Sheet für detaillierte Auswertungen
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
              onClick={() => setSelectedSheet(sheet)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
