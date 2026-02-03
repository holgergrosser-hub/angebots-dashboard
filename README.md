# Angebots-Dashboard

Web-Anwendung zur Auswertung von Kundenanfragen und Angeboten aus mehreren Google Sheets.

## 🎯 Features

- **Multi-Sheet-Support**: Verwalte mehrere Angebots-Sheets zentral
- **Zeitbasierte Auswertungen**: Heute, 7 Tage, 30 Tage, aktuelles/letztes Jahr
- **Globale Suche**: Durchsuche alle Sheets nach Kundennamen
- **Einfache Erweiterung**: Neue Sheets ohne Code-Änderungen hinzufügen
- **Performance**: Intelligentes Caching der Sheet-Daten

## 🏗️ Architektur

```
┌─────────────────┐
│   Netlify       │
│   (Frontend)    │
│   Vite + React  │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────┐
│ Google Apps     │
│ Script Web-App  │
│ (Backend API)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Google Sheets   │
│ (Datenquelle)   │
└─────────────────┘
```

## 📋 Voraussetzungen

- **Google Account** mit Zugriff auf Google Sheets
- **Node.js** (Version 18+)
- **clasp** (Google Apps Script CLI)
- **Git** & **GitHub Account**
- **Netlify Account** (kostenlos)

## 🚀 Setup-Anleitung

### 1️⃣ Google Apps Script Backend

#### a) clasp installieren & einrichten

```bash
# clasp global installieren
npm install -g @google/clasp

# Bei Google anmelden
clasp login

# In Apps Script Ordner wechseln
cd apps-script

# Neues Apps Script Projekt erstellen
clasp create --title "Angebots-Dashboard API" --type webapp
```

#### b) Konfiguration anpassen

Öffne `apps-script/Config.js` und passe an:

```javascript
const CONFIG = {
  TIMEZONE: 'Europe/Berlin',  // Deine Zeitzone
  
  COLUMNS: {
    DATUM: 'Datum',           // Name deiner Datum-Spalte
    KUNDENNAME: 'Kundenname', // Name deiner Kundenname-Spalte
    BETRAG: 'Betrag',         // Name deiner Betrag-Spalte
    STATUS: 'Status'          // Name deiner Status-Spalte
  },
  
  SHEETS: [
    {
      sheetId: 'sheet1',
      sheetName: 'Mein erstes Sheet',
      spreadsheetId: 'GOOGLE_SHEET_ID_HIER',  // ← Aus URL kopieren!
      tabName: 'Angebote',
      inputUrl: 'https://docs.google.com/forms/d/...',
      offerUrl: 'https://docs.google.com/spreadsheets/d/...',
      aktiv: true
    }
  ]
}
```

**Google Sheet ID finden:**
```
URL: https://docs.google.com/spreadsheets/d/1ABC123xyz456/edit
ID:  1ABC123xyz456
```

#### c) Apps Script deployen

```bash
# Code hochladen
clasp push

# Als Web-App bereitstellen
clasp deploy --description "Initial deployment"

# Deployment-ID notieren!
```

**Alternative im Browser:**
1. Gehe zu https://script.google.com
2. Öffne dein Projekt
3. Klicke auf "Bereitstellen" → "Neue Bereitstellung"
4. Typ: "Web-App"
5. Zugriff: "Jeder" (oder "Nur Google Workspace Nutzer")
6. **WICHTIG: URL kopieren!**

### 2️⃣ Frontend Setup

#### a) Dependencies installieren

```bash
cd frontend
npm install
```

#### b) Environment Variable setzen

Erstelle `.env` im `frontend/` Ordner:

```env
VITE_API_URL=https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec
```

**ODER** direkt in `src/api/client.js` eintragen:

```javascript
const API_URL = 'https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec'
```

#### c) Lokal testen

```bash
npm run dev
# Öffnet http://localhost:3000
```

### 3️⃣ GitHub Setup

```bash
# Im Hauptverzeichnis
cd ..
git init
git add .
git commit -m "Initial commit: Angebots-Dashboard"

# GitHub Repository erstellen (via GitHub Website)
# Dann:
git remote add origin https://github.com/DEIN_USERNAME/angebots-dashboard.git
git branch -M main
git push -u origin main
```

### 4️⃣ Netlify Deployment

#### Option A: Automatisch via GitHub

1. Gehe zu https://app.netlify.com
2. "Add new site" → "Import from Git"
3. Wähle dein GitHub Repo
4. Build Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `frontend/dist`
5. Environment Variables:
   - Key: `VITE_API_URL`
   - Value: `https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec`
6. "Deploy site"

#### Option B: Manuell via CLI

```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## 🔧 Nach Code-Änderungen

### Apps Script ändern:

```bash
cd apps-script

# Code bearbeiten (Code.js, Config.js)

# Hochladen
clasp push

# WICHTIG: Neue Bereitstellung erstellen!
clasp deploy --description "Update XYZ"

# Neue URL im Frontend einsetzen
```

**Im Browser:**
1. Code ändern
2. "Bereitstellen" → "Bereitstellungen verwalten"
3. **Neue Bereitstellung** erstellen (nicht aktualisieren!)
4. Neue URL kopieren und im Frontend einsetzen

### Frontend ändern:

```bash
cd frontend

# Code bearbeiten

# Lokal testen
npm run dev

# Zu GitHub pushen (triggert Auto-Deploy auf Netlify)
git add .
git commit -m "Update: ..."
git push
```

## 📊 Neue Sheets hinzufügen

1. Öffne `apps-script/Config.js`
2. Füge ein neues Objekt in `CONFIG.SHEETS` hinzu:

```javascript
{
  sheetId: 'sheet2',                                    // Eindeutige ID
  sheetName: 'Zweites Sheet',                           // Anzeigename
  spreadsheetId: 'ANDERE_GOOGLE_SHEET_ID',              // Aus URL
  tabName: 'Angebote',                                   // Tab-Name
  inputUrl: 'https://docs.google.com/forms/d/...',
  offerUrl: 'https://docs.google.com/spreadsheets/d/...',
  aktiv: true
}
```

3. `clasp push`
4. **Neue Bereitstellung erstellen!**
5. Fertig! Kein Frontend-Code nötig.

## 🐛 Troubleshooting

### "API_URL nicht gesetzt" Fehler

→ Prüfe `frontend/src/api/client.js` oder `.env` Datei

### "Fehler beim Laden der Sheets"

→ Prüfe Apps Script URL und Deployment-Permissions

### "Spalte nicht gefunden"

→ Passe `CONFIG.COLUMNS` in `Config.js` an

### Apps Script Änderungen werden nicht übernommen

→ **WICHTIG:** Erstelle eine **NEUE** Bereitstellung (nicht aktualisieren!)

### Netlify Build schlägt fehl

→ Prüfe `netlify.toml`: `command = "npm install && npm run build"`  
→ Prüfe `vite.config.js`: `minify: 'esbuild'` (NICHT terser!)

### CORS-Fehler beim API-Call

→ Apps Script `doGet` muss `ContentService.createTextOutput()` zurückgeben  
→ KEIN `Content-Type` Header im Frontend-Fetch setzen!

## 📁 Projektstruktur

```
angebots-dashboard/
├── apps-script/          # Google Apps Script Backend
│   ├── Code.js          # Haupt-API-Logik
│   ├── Config.js        # Sheet-Konfiguration
│   └── appsscript.json  # Apps Script Manifest
│
├── frontend/             # Netlify Frontend
│   ├── src/
│   │   ├── api/         # API Client
│   │   ├── components/  # React Komponenten
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js   # WICHTIG: minify: 'esbuild'
│   └── netlify.toml     # WICHTIG: build command
│
├── .gitignore
└── README.md
```

## 🎨 Tech Stack

- **Backend:** Google Apps Script
- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Deployment:** Netlify
- **Versionierung:** Git + GitHub

## 📝 Best Practices

### Apps Script

✅ Immer neue Bereitstellung nach Änderungen  
✅ Cache nutzen für Performance (10 Min TTL)  
✅ Fehlerbehandlung mit try-catch  
✅ Logging für Debugging

### Frontend

✅ `minify: 'esbuild'` in vite.config.js  
✅ Kein `Content-Type` Header bei Apps Script Calls  
✅ Environment Variables für API-URL  
✅ Loading States & Error Handling

### Deployment

✅ `npm install && npm run build` in netlify.toml  
✅ Auto-Deploy via GitHub  
✅ Neue Apps Script URL nach jedem Deploy

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfe Troubleshooting-Sektion
2. Schaue in Browser-Konsole (F12)
3. Prüfe Apps Script Logs: `clasp logs`

## 📄 Lizenz

Privates Projekt von Holger Grosser

---

**Erstellt mit ❤️ und Claude**
