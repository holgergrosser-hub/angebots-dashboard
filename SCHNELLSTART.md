# ⚡ Schnellstart-Checkliste

## Phase 1: Google Apps Script Setup ✓

### 1.1 clasp installieren & anmelden
```bash
npm install -g @google/clasp
clasp login
```

### 1.2 Apps Script Projekt erstellen
```bash
cd apps-script
clasp create --title "Angebots-Dashboard API" --type webapp
```
→ Notiere die Script-ID aus `.clasp.json`

### 1.3 Konfiguration anpassen

**In `Config.js` eintragen:**
- [ ] Zeitzone anpassen (Europe/Berlin oder America/Mexico_City)
- [ ] Spaltennamen aus deinem Sheet eintragen
- [ ] Google Sheet ID eintragen (aus URL kopieren)
- [ ] Sheet-Namen anpassen
- [ ] URLs zu Formular/Sheet eintragen

**Google Sheet ID finden:**
```
URL: https://docs.google.com/spreadsheets/d/1ABC123xyz456/edit
ID:  1ABC123xyz456
```

### 1.4 Deployen
```bash
clasp push
clasp deploy --description "Initial deployment"
```

**ODER im Browser:**
1. Gehe zu https://script.google.com
2. Öffne dein Projekt
3. "Bereitstellen" → "Neue Bereitstellung"
4. Typ: Web-App
5. Zugriff: "Jeder"
6. **URL KOPIEREN!** (Format: https://script.google.com/macros/s/ABC.../exec)

---

## Phase 2: Frontend Setup ✓

### 2.1 Dependencies installieren
```bash
cd frontend
npm install
```

### 2.2 Apps Script URL eintragen

**Option A: .env Datei erstellen**
```bash
# Erstelle .env aus .env.example
cp .env.example .env

# Öffne .env und trage deine Apps Script URL ein
VITE_API_URL=https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec
```

**Option B: Direkt in Code**
Öffne `src/api/client.js` und ersetze:
```javascript
const API_URL = 'https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec'
```

### 2.3 Lokal testen
```bash
npm run dev
```
→ Öffnet http://localhost:3000

**Prüfung:**
- [ ] Siehst du die Sheets?
- [ ] Kannst du auf ein Sheet klicken?
- [ ] Werden die Statistiken geladen?
- [ ] Funktioniert die Suche?

---

## Phase 3: GitHub Setup ✓

```bash
# Im Hauptverzeichnis (angebots-dashboard/)
git init
git add .
git commit -m "Initial commit: Angebots-Dashboard"

# GitHub Repository erstellen (via Website)
# Dann:
git remote add origin https://github.com/DEIN_USERNAME/angebots-dashboard.git
git branch -M main
git push -u origin main
```

---

## Phase 4: Netlify Deployment ✓

### 4.1 Via Website (Empfohlen)
1. Gehe zu https://app.netlify.com
2. "Add new site" → "Import from Git"
3. GitHub authorisieren
4. Repository wählen: `angebots-dashboard`

**Build Settings:**
```
Base directory:      frontend
Build command:       npm install && npm run build
Publish directory:   frontend/dist
```

**Environment Variables:**
```
VITE_API_URL = https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec
```

5. "Deploy site"
6. Warte auf grünes Deployment
7. **URL notieren!** (z.B. https://dein-dashboard.netlify.app)

### 4.2 Via CLI (Alternative)
```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## ✅ Finale Checks

- [ ] Apps Script ist deployed und URL ist kopiert
- [ ] Frontend läuft lokal (npm run dev)
- [ ] GitHub Repository ist erstellt
- [ ] Netlify Deployment ist erfolgreich
- [ ] Live-URL funktioniert (https://....netlify.app)
- [ ] Sheets werden in der App angezeigt
- [ ] Statistiken werden geladen
- [ ] Suche funktioniert

---

## 🔄 Workflow für zukünftige Änderungen

### Apps Script ändern:
```bash
cd apps-script
# Code bearbeiten (Code.js, Config.js)
clasp push
clasp deploy --description "Update XYZ"
# ⚠️ WICHTIG: Neue URL kopieren und im Frontend einsetzen!
```

### Frontend ändern:
```bash
cd frontend
# Code bearbeiten
git add .
git commit -m "Update: ..."
git push
# → Auto-Deploy auf Netlify
```

### Neues Sheet hinzufügen:
1. Öffne `apps-script/Config.js`
2. Füge neues Objekt in `CONFIG.SHEETS` hinzu
3. `clasp push`
4. Neue Bereitstellung erstellen
5. Fertig! (Kein Frontend-Code nötig)

---

## 🐛 Quick Fixes

**Problem: "API URL nicht gesetzt"**
→ Prüfe `frontend/src/api/client.js` oder `.env`

**Problem: "Fehler beim Laden der Sheets"**
→ Prüfe Apps Script URL und Berechtigungen

**Problem: "Spalte nicht gefunden"**
→ Passe `CONFIG.COLUMNS` in `Config.js` an

**Problem: Apps Script Änderungen nicht sichtbar**
→ **Neue Bereitstellung erstellen** (nicht aktualisieren!)

**Problem: Netlify Build schlägt fehl**
→ Prüfe netlify.toml: `command = "npm install && npm run build"`
→ Prüfe vite.config.js: `minify: 'esbuild'`

---

## 📞 Nächste Schritte nach Setup

1. **Teste alle Funktionen** lokal
2. **Passe Design an** (Farben in tailwind.config.js)
3. **Füge weitere Sheets hinzu**
4. **Teile die Live-URL** mit deinem Team

**Live-URL wird sein:**
```
https://dein-projekt-name.netlify.app
```

Du kannst den Namen in Netlify → Site Settings → Site Details ändern.

---

**Viel Erfolg! 🚀**
