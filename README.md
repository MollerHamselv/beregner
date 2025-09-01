# Beregner - Stress Omkostningsberegner

En dansk stress omkostningsberegner udviklet for Medica Pro. Serverless web-applikation deployed på Vercel.

## 📁 Projektstruktur

```
├── docs/                     # 📚 Dokumentation
│   ├── API_STATUS_RAPPORT.md
│   ├── TESTING_CHECKLIST.md
│   └── CODE_CITATIONS.md
├── scripts/                  # 🔧 Test & utility scripts
│   ├── quick-test.sh
│   └── test-api-logic.sh
├── api/                      # ⚡ Backend API (Vercel Functions)
│   ├── collect.js
│   └── admin/
├── index.html                # 🎨 Hovedberegner
├── admin.html               # 🛠️ Admin dashboard
├── script.js                # 📝 Frontend logik
├── style.css                # 🎨 Styling
├── vercel.json              # 🚀 Deployment konfiguration
└── package.json             # 📦 Dependencies
```

## 🚀 Kom i gang

### Lokal udvikling
```bash
# Test applikationen
./scripts/quick-test.sh http://localhost:8080

# Test API logik
./scripts/test-api-logic.sh
```

### Deployment
Deploy til Vercel via Git push eller Vercel CLI.

## 📊 Features

- ✅ Dansk stress omkostningsberegner
- ✅ GDPR-compliant data indsamling
- ✅ Admin dashboard med statistikker
- ✅ PDF export funktionalitet
- ✅ Responsive design med TailwindCSS
