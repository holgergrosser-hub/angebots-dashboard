import { useState, useEffect } from 'react'
import { fetchAPI } from './api/client'
import Dashboard from './components/Dashboard'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [sheets, setSheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadSheets()
  }, [])

  const loadSheets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchAPI('getSheets')

      if (response.success) {
        setSheets(response.data)
      } else {
        throw new Error(response.error || 'Fehler beim Laden der Sheets')
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null)
      setSearchQuery('')
      return
    }

    try {
      setError(null)
      setSearchQuery(query)
      const response = await fetchAPI('search', { query })

      if (response.success) {
        setSearchResults(response.data)
      } else {
        throw new Error(response.error || 'Fehler bei der Suche')
      }
    } catch (err) {
      console.error('Suchfehler:', err)
      setError(err?.message || String(err))
    }
  }

  const clearSearch = () => {
    setSearchResults(null)
    setSearchQuery('')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Angebots-Dashboard</h1>
                <p className="text-gray-600 mt-1">Übersicht aller Kundenanfragen und Angebote</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {sheets.length} {sheets.length === 1 ? 'Sheet' : 'Sheets'}
                </span>
                <button
                  onClick={loadSheets}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Aktualisieren"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-6">
              <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {searchResults ? (
            <SearchResults results={searchResults} query={searchQuery} onClear={clearSearch} />
          ) : (
            <Dashboard sheets={sheets} />
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">Angebots-Dashboard © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App
import { useState, useEffect } from 'react'
import { fetchAPI } from './api/client'
import Dashboard from './components/Dashboard'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [sheets, setSheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Sheets beim Start laden
  useEffect(() => {
    loadSheets()
  }, [])

  const loadSheets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchAPI('getSheets')

      if (response.success) {
        setSheets(response.data)
      } else {
        throw new Error(response.error || 'Fehler beim Laden der Sheets')
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null)
      setSearchQuery('')
      return
    }

    try {
      setError(null)
      setSearchQuery(query)
      const response = await fetchAPI('search', { query })

      if (response.success) {
        setSearchResults(response.data)
      } else {
        throw new Error(response.error || 'Fehler bei der Suche')
      }
    } catch (err) {
      console.error('Suchfehler:', err)
      setError(err?.message || String(err))
    }
  }

  const clearSearch = () => {
    setSearchResults(null)
    setSearchQuery('')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Angebots-Dashboard</h1>
                <p className="text-gray-600 mt-1">Übersicht aller Kundenanfragen und Angebote</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {sheets.length} {sheets.length === 1 ? 'Sheet' : 'Sheets'}
                </span>
                <button
                  onClick={loadSheets}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Aktualisieren"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Suchleiste */}
            <div className="mt-6">
              <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {searchResults ? (
            <SearchResults results={searchResults} query={searchQuery} onClear={clearSearch} />
          ) : (
            <Dashboard sheets={sheets} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-gray-500 text-sm">Angebots-Dashboard © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App
import { useState, useEffect } from 'react'
import { fetchAPI } from './api/client'
import Dashboard from './components/Dashboard'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [sheets, setSheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Sheets beim Start laden
  useEffect(() => {
    loadSheets()
  }, [])

  const loadSheets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchAPI('getSheets')
      
      if (response.success) {
        setSheets(response.data)
      } else {
        throw new Error(response.error || 'Fehler beim Laden der Sheets')
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null)
      setSearchQuery('')
      return
    }

    try {
      setSearchQuery(query)
      const response = await fetchAPI('search', { query })
      
      if (response.success) {
        setSearchResults(response.data)
      } else {
        throw new Error(response.error || 'Fehler bei der Suche')
      }
    } catch (err) {
      console.error('Suchfehler:', err)
      setError(err.message)
    }
  }

  const clearSearch = () => {
    setSearchResults(null)
    setSearchQuery('')
  }

  if (loading) {
    return <LoadingSpinner />
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Angebots-Dashboard</h1>
              <p className="text-gray-600 mt-1">Übersicht aller Kundenanfragen und Angebote</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {sheets.length} {sheets.length === 1 ? 'Sheet' : 'Sheets'}
              </span>
              <button
                onClick={loadSheets}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Aktualisieren"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Suchleiste */}
          <div className="mt-6">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searchResults ? (
          <SearchResults 
            results={searchResults} 
            query={searchQuery}
            onClear={clearSearch}
          />
        ) : (
          <Dashboard sheets={sheets} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Angebots-Dashboard © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
