# ⚠️ WICHTIGE BEST PRACTICES

## Aus Erfahrung gelernt - Diese Fehler NICHT wiederholen!

---

## 🔴 KRITISCH: Apps Script Deployment

### ❌ FALSCH
```
Apps Script Code ändern
→ "Bereitstellung aktualisieren" klicken
→ Alte URL verwenden
```

### ✅ RICHTIG
```
Apps Script Code ändern
→ "NEUE Bereitstellung" erstellen
→ NEUE URL kopieren
→ NEUE URL im Frontend einsetzen
```

**Warum?** 
Aktualisierte Bereitstellungen führen oft zu Cache-Problemen. Eine neue Bereitstellung ist immer sicherer!

---

## 🔴 KRITISCH: Netlify Build Command

### ❌ FALSCH (in netlify.toml)
```toml
[build]
  command = "npm run build"
  # ← Fehlt npm install!
```

### ✅ RICHTIG
```toml
[build]
  command = "npm install && npm run build"
  # ← IMMER mit npm install!
```

**Warum?**
Netlify cached node_modules nicht zuverlässig. Ohne `npm install` fehlen Dependencies!

---

## 🔴 KRITISCH: Vite Minify

### ❌ FALSCH (in vite.config.js)
```javascript
export default defineConfig({
  build: {
    minify: 'terser',  // ← FALSCH!
  }
})
```

### ✅ RICHTIG
```javascript
export default defineConfig({
  build: {
    minify: 'esbuild',  // ← IMMER esbuild!
  }
})
```

**Warum?**
`terser` führt zu "terser not found" Fehlern auf Netlify. `esbuild` ist schneller und zuverlässiger!

---

## 🔴 KRITISCH: Google Apps Script Fetch

### ❌ FALSCH (im Frontend)
```javascript
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'  // ← FALSCH!
  },
  body: JSON.stringify(data)
})
```

### ✅ RICHTIG
```javascript
// Option 1: GET Request (empfohlen für Apps Script)
fetch(url + '?action=getSheets')

// Option 2: POST mit FormData
const formData = new FormData()
formData.append('action', 'getSheets')
fetch(url, {
  method: 'POST',
  body: formData
  // KEIN Content-Type Header!
})

// Option 3: No-CORS Mode
fetch(url, {
  mode: 'no-cors'
})
```

**Warum?**
Apps Script Web-Apps haben spezielle CORS-Regeln. Content-Type Header führen zu Fehlern!

---

## 📋 Deployment Checkliste

### Jedes Mal wenn du Apps Script Code änderst:

```bash
1. clasp push
2. clasp deploy --description "Beschreibung der Änderung"
3. Neue URL kopieren (Format: https://script.google.com/macros/s/.../exec)
4. URL im Frontend einsetzen (.env oder client.js)
5. Frontend testen (npm run dev)
6. Zu GitHub pushen
7. Netlify Deployment abwarten
8. Live-URL testen
```

---

## 🔧 Konfigurationsdateien immer prüfen

### Bei JEDEM neuen Projekt:

**netlify.toml:**
```toml
[build]
  command = "npm install && npm run build"  ✓
  publish = "dist"                           ✓

[build.environment]
  NODE_VERSION = "20"                        ✓
```

**vite.config.js:**
```javascript
build: {
  minify: 'esbuild',  ✓
}
```

**package.json:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",  ✓
  }
}
```

---

## 🎯 Apps Script Besonderheiten

### Caching
```javascript
// ✓ Cache nutzen für Performance
const cache = CacheService.getScriptCache()
const cached = cache.get(key)

// TTL setzen (in Sekunden)
cache.put(key, data, 600)  // 10 Minuten
```

### Error Handling
```javascript
// ✓ Immer try-catch verwenden
try {
  const sheet = SpreadsheetApp.openById(id)
} catch (error) {
  Logger.log('Fehler: ' + error.toString())
  return { success: false, error: error.toString() }
}
```

### JSON Response
```javascript
// ✓ IMMER ContentService verwenden
function doGet(e) {
  const data = { success: true, message: 'OK' }
  
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
```

---

## 🌍 Timezone Handling

### Datums-Operationen
```javascript
// ✓ Timezone beachten
const CONFIG = {
  TIMEZONE: 'Europe/Berlin'  // oder 'America/Mexico_City'
}

// Datum formatieren
Utilities.formatDate(
  new Date(), 
  CONFIG.TIMEZONE, 
  'yyyy-MM-dd'
)
```

---

## 🔒 Security Best Practices

### API URLs
```javascript
// ✓ Nie hardcoden
const API_URL = import.meta.env.VITE_API_URL

// ✗ NICHT committen
const API_URL = 'https://script.google.com/macros/s/ABC123.../exec'
```

### .gitignore
```
.env          ✓
.clasp.json   ✓
node_modules/ ✓
dist/         ✓
```

---

## 📊 Performance Tipps

### 1. Cache nutzen
- Sheet-Daten für 5-10 Minuten cachen
- Cache-Keys mit Datum versehen
- Fallback bei Cache-Fehlern

### 2. Lazy Loading
- Statistiken erst bei Klick laden
- Nicht alle Sheets auf einmal

### 3. Pagination
- Bei vielen Ergebnissen nur Top 20 zeigen
- "Mehr laden" Button

---

## 🐛 Debugging

### Apps Script Logs
```bash
# Im Terminal
clasp logs

# Oder im Browser
script.google.com → Executions
```

### Frontend Logs
```javascript
// In client.js
console.log('API Call:', url.toString())
console.log('API Response:', data)
```

### Browser DevTools
- F12 öffnen
- Network Tab → API Calls prüfen
- Console Tab → Fehler sehen

---

## 📝 Dokumentation

### Code kommentieren
```javascript
/**
 * Lädt Statistiken für ein Sheet
 * 
 * @param {string} sheetId - Sheet-ID
 * @returns {object} Stats mit heute, 7T, 30T, Jahr
 */
```

### README aktuell halten
- Bei jeder größeren Änderung
- Setup-Schritte dokumentieren
- Bekannte Probleme notieren

---

## 🎓 Lessons Learned

1. **IMMER neue Apps Script Bereitstellung** erstellen
2. **IMMER `npm install &&`** vor `npm run build`
3. **IMMER `minify: 'esbuild'`** in vite.config.js
4. **NIEMALS Content-Type Header** bei Apps Script
5. **IMMER .env in .gitignore**
6. **IMMER testen** vor dem Push
7. **IMMER Logs prüfen** bei Fehlern

---

**Diese Regeln haben sich in der Praxis bewährt!**
