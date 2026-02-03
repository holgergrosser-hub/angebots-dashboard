/**
 * API Client fÃƒÂ¼r Google Apps Script Backend
 * 
 * WICHTIG: Nach Apps Script Deployment die URL hier eintragen!
 */

// Apps Script Web-App URL (wird nach Deployment gesetzt)
const API_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * FÃƒÂ¼hrt einen API-Call zum Apps Script Backend aus
 * 
 * @param {string} action - API Action (z.B. 'getSheets', 'getStats', 'search')
 * @param {object} params - ZusÃƒÂ¤tzliche Parameter
 * @returns {Promise<object>} API Response
 */
export async function fetchAPI(action, params = {}) {
  try {
    // URL mit Query-Parametern bauen
    const url = new URL(API_URL, window.location.origin)
    url.searchParams.append('action', action)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
    
    console.log('API Call:', url.toString())
    
    // WICHTIG: Bei Google Apps Script:
    // - KEIN Content-Type Header setzen!
    // - GET-Request verwenden
    const response = await fetch(url.toString(), {
      method: 'GET',
      // Keine Headers bei Apps Script!
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    
    return data
    
  } catch (error) {
    console.error('API Fehler:', error)
    throw new Error(`API-Aufruf fehlgeschlagen: ${error.message}`)
  }
}

/**
 * LÃƒÂ¤dt Statistiken fÃƒÂ¼r ein bestimmtes Sheet
 * 
 * @param {string} sheetId - Sheet-ID
 * @returns {Promise<object>} Statistik-Daten
 */
export async function getSheetStats(sheetId) {
  return fetchAPI('getStats', { sheetId })
}

/**
 * Sucht nach Kunden ÃƒÂ¼ber alle Sheets
 * 
 * @param {string} query - Suchbegriff
 * @returns {Promise<object>} Suchergebnisse
 */
export async function searchCustomers(query) {
  return fetchAPI('search', { query })
}

/**
 * Formatiert Betrag als WÃƒÂ¤hrung
 * 
 * @param {number} amount - Betrag
 * @param {string} currency - WÃƒÂ¤hrungscode (Standard: EUR)
 * @returns {string} Formatierter Betrag
 */
export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Formatiert Datum
 * 
 * @param {string} dateString - ISO Datum-String
 * @returns {string} Formatiertes Datum
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('de-DE').format(date)
}



