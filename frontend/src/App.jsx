import { useEffect, useMemo, useState } from 'react'
import { fetchAPI } from './api/client'

import Dashboard from './components/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import CompanyPicker from './components/CompanyPicker'

function AppInner() {
  const [sheets, setSheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searchError, setSearchError] = useState(null)

  const sheetCountLabel = useMemo(() => {
    const count = sheets.length
    return `${count} ${count === 1 ? 'Sheet' : 'Sheets'}`
  }, [sheets.length])

  async function loadSheets() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetchAPI('getSheets')
      const list = Array.isArray(res?.data) ? res.data : []
      setSheets(list)
    } catch (err) {
      setError(err?.message || 'Fehler beim Laden der Sheets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSheets()
  }, [])

  async function handleSearch(query) {
    const nextQuery = (query || '').trim()
    setSearchQuery(nextQuery)
    setSearchError(null)

    if (!nextQuery) {
      setSearchResults(null)
      setSearchError(null)
      return
    }

    try {
      const res = await fetchAPI('search', { query: nextQuery })
      const list = Array.isArray(res?.data) ? res.data : []
      setSearchResults(list)
    } catch (err) {
      setSearchResults([])
      setSearchError(err?.message || 'Suche fehlgeschlagen')
    }
  }

  function clearSearch() {
    setSearchQuery('')
    setSearchResults(null)
    setSearchError(null)
  }

  function setQueryAndSearch(nextQuery) {
    const q = (nextQuery || '').trim()
    setSearchQuery(q)
    handleSearch(q)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" message="Lade Daten..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Fehler</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={loadSheets}
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Angebots-Dashboard</h1>
              <p className="text-gray-600 mt-1">Übersicht aller Kundenanfragen und Angebote</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{sheetCountLabel}</span>

              <a
                href="https://docs.google.com/spreadsheets/d/1V_02PcvdCON0_HdS_Im7nVJ9RKav99_2OCpwfadj94I/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title="Kundentabelle (Google Sheet) öffnen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Kundentabelle öffnen
              </a>

              <button
                onClick={loadSheets}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Aktualisieren"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6">
            <SearchBar
              onSearch={handleSearch}
              query={searchQuery}
              onQueryChange={setSearchQuery}
            />

            <div className="mt-4">
              <CompanyPicker onPick={setQueryAndSearch} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchResults ? (
          <SearchResults results={searchResults} query={searchQuery} error={searchError} onClear={clearSearch} />
        ) : (
          <Dashboard sheets={sheets} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Angebots-Dashboard © {new Date().getFullYear()}
          </p>
          <p className="text-center text-gray-400 text-xs mt-1">
            Revision: {import.meta.env.VITE_APP_REVISION} · Build: {import.meta.env.VITE_APP_BUILD_TIME}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  )
}

