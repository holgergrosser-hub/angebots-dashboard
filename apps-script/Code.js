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

      case 'getCrmCompanies':
        response = getCrmCompanies_();
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

      case 'getToday':
        response = getTodayOffersAllSheets_(e.parameter.nocache === '1');
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

/**
 * Liefert die Firmenliste aus dem CRM "Super Master".
 * Erwartet: Tab CONFIG.CRM_SHEET_NAME, Firmennamen in Spalte A ab Zeile 2.
 */
function getCrmCompanies_() {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'crm_companies_v1';

  const cached = cache.get(cacheKey);
  if (cached) {
    return { success: true, data: JSON.parse(cached), cached: true };
  }

  if (!CONFIG.CRM_SUPER_MASTER_ID) throw new Error('CRM_SUPER_MASTER_ID fehlt in Config');
  if (!CONFIG.CRM_SHEET_NAME) throw new Error('CRM_SHEET_NAME fehlt in Config');

  const ss = SpreadsheetApp.openById(CONFIG.CRM_SUPER_MASTER_ID);
  const sheet = ss.getSheetByName(CONFIG.CRM_SHEET_NAME);
  if (!sheet) throw new Error('CRM Tab nicht gefunden: ' + CONFIG.CRM_SHEET_NAME);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    cache.put(cacheKey, JSON.stringify([]), 300);
    return { success: true, data: [] };
  }

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const list = values
    .map(r => (r && r[0] != null ? String(r[0]).trim() : ''))
    .filter(Boolean);

  cache.put(cacheKey, JSON.stringify(list), 300);
  return { success: true, data: list };
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Gibt Liste aller konfigurierten Sheets zurÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ck
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
 * Berechnet Statistiken fÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼r ein Sheet
 */
function getSheetStats(sheetId) {
  const cacheKey = `stats_${sheetId}_${Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd')}`;
  const cache = CacheService.getScriptCache();
  
  // Cache prÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼fen
  const cached = cache.get(cacheKey);
  if (cached) {
    Logger.log('Cache Hit fÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼r: ' + cacheKey);
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
 * Aggregierte "Heute"-Ãœbersicht Ã¼ber alle aktiven implying Sheets.
 * Optional: nocache=1 (bypassed ScriptCache)
 */
function getTodayOffersAllSheets_(nocache) {
  const dayKey = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd');
  const cacheKey = `today_${dayKey}`;
  const cache = CacheService.getScriptCache();

  if (!nocache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const sheets = CONFIG.SHEETS.filter(s => s.aktiv);
  const perSheet = [];
  const offers = [];
  let totalCount = 0;
  let totalSum = 0;

  sheets.forEach(cfg => {
    try {
      const data = getSheetData(cfg.sheetId);
      const today = calculatePeriodStats(data, 'today');
      const items = Array.isArray(today.angebote) ? today.angebote : [];

      const count = Number(today.anzahl || items.length) || 0;
      const sum = Number(today.summe) || 0;
      totalCount += count;
      totalSum += sum;

      items.forEach(it => {
        offers.push({
          sheetId: cfg.sheetId,
          sheetName: cfg.sheetName,
          inputUrl: cfg.inputUrl || '',
          offerUrl: cfg.offerUrl || '',
          datum: it.datum,
          kundenname: it.kundenname,
          betrag: it.betrag,
          status: it.status
        });
      });

      perSheet.push({
        sheetId: cfg.sheetId,
        sheetName: cfg.sheetName,
        inputUrl: cfg.inputUrl || '',
        offerUrl: cfg.offerUrl || '',
        anzahl: count,
        summe: sum,
        angebote: items
      });
    } catch (err) {
      Logger.log(`Fehler getTodayOffers fÃ¼r ${cfg.sheetName}: ${err}`);
      perSheet.push({
        sheetId: cfg.sheetId,
        sheetName: cfg.sheetName,
        inputUrl: cfg.inputUrl || '',
        offerUrl: cfg.offerUrl || '',
        anzahl: 0,
        summe: 0,
        angebote: [],
        error: String(err)
      });
    }
  });

  const result = {
    success: true,
    date: dayKey,
    total: { anzahl: totalCount, summe: totalSum },
    sheets: perSheet,
    offers: offers,
    generatedAt: new Date().toISOString()
  };

  // Short cache: 60s (keeps it fast, still updates quickly)
  cache.put(cacheKey, JSON.stringify(result), 60);
  return result;
}

/**
 * Sucht nach Kunden ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ber alle Sheets
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
 * LÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤dt Daten aus einem Sheet
 */
function getSheetData(sheetId) {
  const sheetConfig = CONFIG.SHEETS.find(s => s.sheetId === sheetId);
  if (!sheetConfig) throw new Error('Sheet nicht gefunden: ' + sheetId);
  
  const ss = SpreadsheetApp.openById(sheetConfig.spreadsheetId);
  const sheet = ss.getSheetByName(sheetConfig.tabName || 'Angebote');
  
  if (!sheet) throw new Error('Tab nicht gefunden');
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Spalten-Mapping (Header oder Spaltenbuchstaben)
  const colIndex = resolveColumnIndices_(sheetConfig, headers);
  // Daten mappen
  return data.slice(1).map(row => ({
    datum: parseDate(row[colIndex.datum]),
    kundenname: row[colIndex.kundenname] || '',
    betrag: parseFloat(row[colIndex.betrag]) || 0,
    status: row[colIndex.status] || ''
  })).filter(row => row.datum); // Nur Zeilen mit Datum
}

/**
 * Berechnet Stats fÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼r einen Zeitraum
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
  
  // Bei "heute" auch die Liste der Angebote zurÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ckgeben
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
 * Erstellt JSON-Response fÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼r Web App
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// =====================================================================
// SETUP (einmalig ausfÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼hren)
// =====================================================================

/**
 * Legt alle in CONFIG.SHEETS definierten Tabs an (falls sie fehlen)
 * und schreibt die Header-Zeile (nur wenn Tab leer ist).
 *
 * AusfÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼hren (lokal): clasp run setupOfferTabs
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

  return { success: true, message: 'Tabs geprÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ft/angelegt.' };
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
    sheet.getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat('#,##0.00 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬');
  }

  // Format Datum column as date if present
  const datumIndex = headers.indexOf(CONFIG.COLUMNS.DATUM);
  if (datumIndex !== -1) {
    const col = datumIndex + 1;
    sheet.getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat('dd.MM.yyyy');
  }
}
/**
 * Ermittelt Spalten-Indizes (0-basiert) entweder ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ber Header-Namen oder ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ber Spaltenbuchstaben.
 * UnterstÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼tzt pro-sheet Overrides via sheetConfig.columns.
 */
function resolveColumnIndices_(sheetConfig, headers) {
  const columns = (sheetConfig && sheetConfig.columns) ? sheetConfig.columns : CONFIG.COLUMNS;

  const keys = {
    datum: 'DATUM',
    kundenname: 'KUNDENNAME',
    betrag: 'BETRAG',
    status: 'STATUS'
  };

  const normalizedHeaders = (headers || []).map(h => String(h || '').trim());
  const colIndex = {};
  const missing = [];

  Object.entries(keys).forEach(([field, colKey]) => {
    const spec = columns[colKey];
    if (spec === undefined || spec === null || String(spec).trim() === '') {
      colIndex[field] = -1;
      missing.push(colKey);
      return;
    }

    // Number: allow 1-based (Sheet column numbers) or 0-based
    if (typeof spec === 'number') {
      colIndex[field] = spec >= 1 ? (spec - 1) : spec;
      return;
    }

    const s = String(spec).trim();

    // Column letters like A, B, AA
    if (/^[A-Za-z]{1,3}$/.test(s)) {
      colIndex[field] = columnLetterToIndex_(s);
      return;
    }

    // Header name match
    const idx = normalizedHeaders.findIndex(h => h === s);
    colIndex[field] = idx;
  });

  Object.entries(colIndex).forEach(([field, idx]) => {
    if (idx === -1) {
      const colKey = keys[field];
      const spec = (sheetConfig && sheetConfig.columns) ? sheetConfig.columns[colKey] : CONFIG.COLUMNS[colKey];
      throw new Error('Spalte nicht gefunden: ' + spec);
    }
  });

  return colIndex;
}

function columnLetterToIndex_(letters) {
  const s = String(letters).trim().toUpperCase();
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code < 65 || code > 90) throw new Error('UngÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¼ltiger Spaltenbuchstabe: ' + letters);
    n = n * 26 + (code - 64);
  }
  return n - 1;
}