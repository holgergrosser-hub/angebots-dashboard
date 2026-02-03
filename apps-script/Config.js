/**
 * Konfiguration für Angebots-Dashboard
 *
 * Hinweis:
 * - CONFIG.SHEETS beschreibt die Tabs ("Tabellen") in einem oder mehreren Google Sheets.
 * - Nach Änderungen: clasp push -f
 * - Danach im Apps Script UI das Web-App Deployment auf die neue Version aktualisieren.
 */

const CONFIG = {

  // Zeitzone für Datumsberechnungen
  TIMEZONE: 'Europe/Berlin',

  // Spaltennamen in deinen Tabs (Kopfzeile in Zeile 1)
  COLUMNS: {
    DATUM: 'Datum',
    KUNDENNAME: 'Kundenname',
    BETRAG: 'Betrag',
    STATUS: 'Status'
  },

  // Tab-Konfiguration (10 Tabellen im selben Spreadsheet)
  SHEETS: [
    {
      sheetId: 't1',
      sheetName: 'Tabelle 1',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 1',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't2',
      sheetName: 'Tabelle 2',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 2',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't3',
      sheetName: 'Tabelle 3',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 3',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't4',
      sheetName: 'Tabelle 4',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 4',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't5',
      sheetName: 'Tabelle 5',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 5',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't6',
      sheetName: 'Tabelle 6',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 6',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't7',
      sheetName: 'Tabelle 7',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 7',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't8',
      sheetName: 'Tabelle 8',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 8',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't9',
      sheetName: 'Tabelle 9',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 9',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    },
    {
      sheetId: 't10',
      sheetName: 'Tabelle 10',
      spreadsheetId: '1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc',
      tabName: 'Tabelle 10',
      inputUrl: '',
      offerUrl: 'https://docs.google.com/spreadsheets/d/1SYFxxneWaCHjjBDoMDHaE-PYqD13djW42CA7g1itsIc/edit',
      aktiv: true
    }
  ]
};