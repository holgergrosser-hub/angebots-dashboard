/**
 * Angebots-Dashboard API
 * Google Apps Script Backend
 */

// =============================================================================
// WEB APP ENTRY POINT
// =============================================================================

function doGet(e) {
  const action = e.parameter.action || 'getSheets';
  
  try {
    let response;
    
    switch(action) {
      case 'getSheets':
        response = getSheetsList();
        break;
      
      case 'getStats':
        const sheetId = e.parameter.sheetId;
        if (!sheetId) throw new Error('sheetId fehlt');
        response = getSheetStats(sheetId);
        break;
      
      case 'search':
        const query = e.parameter.query;
        if (!query) throw new Error('query fehlt');
        response = searchCustomers(query);
        break;
      
      default:
        throw new Error('Unbekannte Action: ' + action);
    }
    
    return createJsonResponse(response);
    
  } catch (error) {
    Logger.log('Fehler in doGet: ' + error.toString());
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Gibt Liste aller konfigurierten Sheets zurÃ¼ck
 */
function getSheetsList() {
  const sheets = CONFIG.SHEETS.filter(s => s.aktiv);
  
  return {
    success: true,
    data: sheets.map(s => ({
      id: s.sheetId,
      name: s.sheetName,
      inputUrl: s.inputUrl,
      offerUrl: s.offerUrl
    }))
  };
}

/**
 * Berechnet Statistiken fÃ¼r ein Sheet
 */
function getSheetStats(sheetId) {
  const cacheKey = `stats_${sheetId}_${Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd')}`;
  const cache = CacheService.getScriptCache();
  
  // Cache prÃ¼fen
  const cached = cache.get(cacheKey);
  if (cached) {
    Logger.log('Cache Hit fÃ¼r: ' + cacheKey);
    return JSON.parse(cached);
  }
  
  // Daten laden
  const data = getSheetData(sheetId);
  
  // Stats berechnen
  const stats = {
    success: true,
    sheetId: sheetId,
    data: {
      heute: calculatePeriodStats(data, 'today'),
      letzte7Tage: calculatePeriodStats(data, 'last7days'),
      letzte30Tage: calculatePeriodStats(data, 'last30days'),
      aktuellesJahr: calculatePeriodStats(data, 'thisYear'),
      letztesJahr: calculatePeriodStats(data, 'lastYear')
    },
    generatedAt: new Date().toISOString()
  };
  
  // In Cache speichern (10 Minuten)
  cache.put(cacheKey, JSON.stringify(stats), 600);
  
  return stats;
}

/**
 * Sucht nach Kunden Ã¼ber alle Sheets
 */
function searchCustomers(query) {
  const results = [];
  const searchQuery = query.toLowerCase();
  
  CONFIG.SHEETS.filter(s => s.aktiv).forEach(sheet => {
    try {
      const data = getSheetData(sheet.sheetId);
      
      const matches = data.filter(row => 
        row.kundenname && row.kundenname.toLowerCase().includes(searchQuery)
      );
      
      if (matches.length > 0) {
        results.push({
          sheetId: sheet.sheetId,
          sheetName: sheet.sheetName,
          offerUrl: sheet.offerUrl,
          matches: matches.map(row => ({
            datum: row.datum,
            kundenname: row.kundenname,
            betrag: row.betrag,
            status: row.status
          }))
        });
      }
    } catch (error) {
      Logger.log(`Fehler beim Durchsuchen von ${sheet.sheetName}: ${error}`);
    }
  });
  
  return {
    success: true,
    query: query,
    totalResults: results.reduce((sum, r) => sum + r.matches.length, 0),
    data: results
  };
}

// =============================================================================
// DATA PROCESSING
// =============================================================================

/**
 * LÃ¤dt Daten aus einem Sheet
 */
function getSheetData(sheetId) {
  const sheetConfig = CONFIG.SHEETS.find(s => s.sheetId === sheetId);
  if (!sheetConfig) throw new Error('Sheet nicht gefunden: ' + sheetId);
  
  const ss = SpreadsheetApp.openById(sheetConfig.spreadsheetId);
  const sheet = ss.getSheetByName(sheetConfig.tabName || 'Angebote');
  
  if (!sheet) throw new Error('Tab nicht gefunden');
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Header-Mapping
  const colIndex = {
    datum: headers.indexOf(CONFIG.COLUMNS.DATUM),
    kundenname: headers.indexOf(CONFIG.COLUMNS.KUNDENNAME),
    betrag: headers.indexOf(CONFIG.COLUMNS.BETRAG),
    status: headers.indexOf(CONFIG.COLUMNS.STATUS)
  };
  
  // Validierung
  Object.entries(colIndex).forEach(([key, index]) => {
    if (index === -1) throw new Error(`Spalte nicht gefunden: ${CONFIG.COLUMNS[key.toUpperCase()]}`);
  });
  
  // Daten mappen
  return data.slice(1).map(row => ({
    datum: parseDate(row[colIndex.datum]),
    kundenname: row[colIndex.kundenname] || '',
    betrag: parseFloat(row[colIndex.betrag]) || 0,
    status: row[colIndex.status] || ''
  })).filter(row => row.datum); // Nur Zeilen mit Datum
}

/**
 * Berechnet Stats fÃ¼r einen Zeitraum
 */
function calculatePeriodStats(data, period) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let startDate, endDate;
  
  switch(period) {
    case 'today':
      startDate = today;
      endDate = new Date(today.getTime() + 24*60*60*1000);
      break;
    
    case 'last7days':
      startDate = new Date(today.getTime() - 7*24*60*60*1000);
      endDate = new Date(today.getTime() + 24*60*60*1000);
      break;
    
    case 'last30days':
      startDate = new Date(today.getTime() - 30*24*60*60*1000);
      endDate = new Date(today.getTime() + 24*60*60*1000);
      break;
    
    case 'thisYear':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
      break;
    
    case 'lastYear':
      startDate = new Date(now.getFullYear() - 1, 0, 1);
      endDate = new Date(now.getFullYear(), 0, 1);
      break;
    
    default:
      throw new Error('Unbekannter Zeitraum: ' + period);
  }
  
  const filtered = data.filter(row => 
    row.datum >= startDate && row.datum < endDate
  );
  
  const summe = filtered.reduce((sum, row) => sum + row.betrag, 0);
  
  const result = {
    anzahl: filtered.length,
    summe: summe,
    startDate: Utilities.formatDate(startDate, CONFIG.TIMEZONE, 'yyyy-MM-dd'),
    endDate: Utilities.formatDate(endDate, CONFIG.TIMEZONE, 'yyyy-MM-dd')
  };
  
  // Bei "heute" auch die Liste der Angebote zurÃ¼ckgeben
  if (period === 'today') {
    result.angebote = filtered.map(row => ({
      datum: Utilities.formatDate(row.datum, CONFIG.TIMEZONE, 'yyyy-MM-dd'),
      kundenname: row.kundenname,
      betrag: row.betrag,
      status: row.status
    }));
  }
  
  return result;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parst Datum aus verschiedenen Formaten
 */
function parseDate(value) {
  if (!value) return null;
  
  if (value instanceof Date) {
    return value;
  }
  
  if (typeof value === 'string') {
    // ISO Format: YYYY-MM-DD
    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
    }
    
    // Deutsches Format: DD.MM.YYYY
    const deMatch = value.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    if (deMatch) {
      return new Date(parseInt(deMatch[3]), parseInt(deMatch[2]) - 1, parseInt(deMatch[1]));
    }
  }
  
  // Fallback: Date-Konstruktor
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Erstellt JSON-Response fÃ¼r Web App
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// =====================================================================
// SETUP (einmalig ausführen)
// =====================================================================

/**
 * Legt alle in CONFIG.SHEETS definierten Tabs an (falls sie fehlen)
 * und schreibt die Header-Zeile (nur wenn Tab leer ist).
 *
 * Ausführen (lokal): clasp run setupOfferTabs
 * Danach im Apps Script UI das Web-App Deployment aktualisieren.
 */
function setupOfferTabs() {
  const requiredHeaders = [
    CONFIG.COLUMNS.DATUM,
    CONFIG.COLUMNS.KUNDENNAME,
    CONFIG.COLUMNS.BETRAG,
    CONFIG.COLUMNS.STATUS
  ];

  // Group by spreadsheetId to avoid repeated openById
  const groups = {};
  CONFIG.SHEETS.forEach(s => {
    if (!s.aktiv) return;
    if (!groups[s.spreadsheetId]) groups[s.spreadsheetId] = [];
    groups[s.spreadsheetId].push(s);
  });

  Object.keys(groups).forEach(spreadsheetId => {
    const ss = SpreadsheetApp.openById(spreadsheetId);
    groups[spreadsheetId].forEach(cfg => {
      const sheet = ensureTab_(ss, cfg.tabName);
      ensureHeaderIfEmpty_(sheet, requiredHeaders);
      formatColumns_(sheet, requiredHeaders);
    });
  });

  return { success: true, message: 'Tabs geprüft/angelegt.' };
}

function ensureTab_(spreadsheet, tabName) {
  let sheet = spreadsheet.getSheetByName(tabName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(tabName);
  }
  return sheet;
}

function ensureHeaderIfEmpty_(sheet, headers) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow === 0 || lastCol === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }

  const firstRow = sheet.getRange(1, 1, 1, Math.max(lastCol, headers.length)).getValues()[0];
  const hasAny = firstRow.some(v => String(v || '').trim() !== '');
  if (!hasAny) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function formatColumns_(sheet, headers) {
  // Format Betrag column as currency if present
  const betragIndex = headers.indexOf(CONFIG.COLUMNS.BETRAG);
  if (betragIndex !== -1) {
    const col = betragIndex + 1;
    sheet.getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat('#,##0.00 €');
  }

  // Format Datum column as date if present
  const datumIndex = headers.indexOf(CONFIG.COLUMNS.DATUM);
  if (datumIndex !== -1) {
    const col = datumIndex + 1;
    sheet.getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat('dd.MM.yyyy');
  }
}