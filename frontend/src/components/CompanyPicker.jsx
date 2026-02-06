import { useEffect, useMemo, useState } from 'react'
import { getCrmCompanies } from '../api/client'

export default function CompanyPicker({ onPick }) {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [value, setValue] = useState('')
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    const q = (filter || '').trim().toLowerCase()
    if (!q) return companies
    return companies.filter(c => c.toLowerCase().includes(q))
  }, [companies, filter])

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const list = await getCrmCompanies()
      setCompanies(list)
    } catch (err) {
      setCompanies([])
      setError(err?.message || 'CRM Firmen konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Lazy load; user can still manually trigger reload.
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pick(name) {
    const n = (name || '').trim()
    if (!n) return
    onPick?.(n)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Firma aus CRM ziehen</label>
          <p className="text-xs text-gray-500 mt-1">Lädt Firmennamen aus dem Super Master und übernimmt sie in die Suche.</p>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter (optional)…"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <input
                list="crm-companies"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    pick(value)
                  }
                }}
                placeholder={loading ? 'Lade Firmen…' : 'Firma auswählen…'}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <datalist id="crm-companies">
                {filtered.slice(0, 500).map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            title="CRM Firmen neu laden"
          >
            Neu laden
          </button>
          <button
            type="button"
            onClick={() => pick(value)}
            disabled={loading || !value.trim()}
            className="px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            Übernehmen
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      ) : null}

      {!error && !loading && companies.length > 0 ? (
        <div className="mt-3 text-xs text-gray-500">
          {companies.length} Firmen geladen
        </div>
      ) : null}
    </div>
  )
}
