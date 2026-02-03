/**
 * Konfiguration für Angebots-Dashboard
 * 
 * ANLEITUNG FÜR NEUE SHEETS:
 * 1. Neues Objekt in CONFIG.SHEETS Array hinzufügen
 * 2. spreadsheetId aus der Google Sheets URL kopieren
 * 3. Nach Code-Änderung: NEUE Apps Script Bereitstellung erstellen!
 */

const CONFIG = {
  
  // Zeitzone für Datumsberechnungen
  TIMEZONE: 'Europe/Berlin',
  
  // Spaltennamen in deinen Sheets (ANPASSEN!)
  COLUMNS: {
    DATUM: 'Datum',              // Name der Datum-Spalte
    KUNDENNAME: 'Kundenname',    // Name der Kundenname-Spalte
    BETRAG: 'Betrag',            // Name der Betrag-Spalte
    STATUS: 'Status'             // Name der Status-Spalte
  },
  
  // Sheet-Konfiguration
  SHEETS: [
    {
      sheetId: 'sheet1',                                    // Eindeutige ID (für API)
      sheetName: 'Beispiel-Sheet 1',                        // Anzeigename
      spreadsheetId: 'DEINE_GOOGLE_SHEET_ID_HIER',          // Aus URL kopieren
      tabName: 'Angebote',                                   // Name des Tabs im Sheet
      inputUrl: 'https://docs.google.com/forms/d/...',      // Link zum Formular (optional)
      offerUrl: 'https://docs.google.com/spreadsheets/d/DEINE_GOOGLE_SHEET_ID_HIER/edit',
      aktiv: true                                            // true = wird ausgewertet
    },
    
    // BEISPIEL für zweites Sheet (auskommentiert):
    /*
    {
      sheetId: 'sheet2',
      sheetName: 'Beispiel-Sheet 2',
      spreadsheetId: 'ANDERE_GOOGLE_SHEET_ID',
      tabName: 'Angebote',
      inputUrl: 'https://docs.google.com/forms/d/...',
      offerUrl: 'https://docs.google.com/spreadsheets/d/ANDERE_GOOGLE_SHEET_ID/edit',
      aktiv: true
    }
    */
  ]
};

/**
 * SETUP-ANLEITUNG:
 * 
 * 1. Google Sheet ID finden:
 *    URL: https://docs.google.com/spreadsheets/d/1ABC123xyz/edit
 *    ID:  1ABC123xyz
 * 
 * 2. Spaltennamen prüfen:
 *    - Öffne dein Google Sheet
 *    - Schaue dir die Kopfzeile an (Zeile 1)
 *    - Passe CONFIG.COLUMNS entsprechend an
 * 
 * 3. Sheet hinzufügen:
 *    - Kopiere ein Beispiel-Objekt aus CONFIG.SHEETS
 *    - Füge es mit Komma getrennt ein
 *    - Passe alle Werte an
 * 
 * 4. Deployment:
 *    - Nach jeder Änderung: clasp push
 *    - Dann: clasp deploy
 *    - ODER im Browser: Neue Bereitstellung erstellen
 *    - NEUE URL kopieren und im Frontend einsetzen!
 */
