/**
 * Konfiguration für Angebots-Dashboard
 *
 * CONFIG.SHEETS = Datenquellen (Google Spreadsheets + Tab).
 * Pro Datenquelle kannst du optional eine eigene Spalten-Zuordnung setzen.
 *
 * Nach Änderungen:
 * - clasp push -f
 * - dann im Apps Script UI: Web-App Deployment auf neue Version aktualisieren
 */

const CONFIG = {

  // CRM Super Master (Firmenliste)
  // Spalte A ab Zeile 2: Firmennamen
  CRM_SUPER_MASTER_ID: '1FWbeX3YeK9Uidyn9obKJ7z-J-zXX1h5PsXcfk_YHAyU',
  CRM_SHEET_NAME: 'Super Master',

  TIMEZONE: 'Europe/Berlin',

  // Default: Spalten über Header-Namen (Kopfzeile)
  // Pro Sheet kann man mit sheet.columns auch Spaltenbuchstaben (A, B, I, M, ...) setzen.
  COLUMNS: {
    DATUM: 'Datum',
    KUNDENNAME: 'Kundenname',
    BETRAG: 'Betrag',
    STATUS: 'Status'
  },

  SHEETS: [
    {
      sheetId: 'anfragen',
      sheetName: 'Anfragen',
      spreadsheetId: '1jNY1BmHNC-iZK-l7DwSmx6m6rsfPvr6kcXGtvjyparE',
      tabName: 'Anfragen',
      inputUrl: 'https://qm-guru-angebote-9001.netlify.app/',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1jNY1BmHNC-iZK-l7DwSmx6m6rsfPvr6kcXGtvjyparE/edit',
      columns: {
        DATUM: 'A',
        KUNDENNAME: 'B',
        BETRAG: 'I',
        STATUS: 'M'
      },
      aktiv: true
    },
    {
      sheetId: 'qm-system-angebot',
      sheetName: 'AngeboteferdieZertifizierung',
      spreadsheetId: '1yrY6xPz34UH2PtESTPanxfMNxas6mtkpvmodg882p8U',
      tabName: 'AngeboteferdieZertifizierung',
      inputUrl: 'https://qm-guru-angebote-9001.netlify.app/',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1yrY6xPz34UH2PtESTPanxfMNxas6mtkpvmodg882p8U/edit?gid=0#gid=0',
      columns: {
        DATUM: 'P',
        KUNDENNAME: 'A',
        BETRAG: 'F',
        STATUS: 'AB'
      },
      aktiv: true
    }
  ]
};