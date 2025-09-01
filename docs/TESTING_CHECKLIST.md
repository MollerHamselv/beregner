# 🧪 KOMPLET TEST CHECKLIST - Beregner System

## 📋 **PRE-DEPLOYMENT TESTS**

### 🌐 **FRONTEND CALCULATOR TESTS**

#### **✅ Input Validation & Constraints**
- [ ] **Medarbejdere field:**
  - [ ] Accepterer værdier 1-100,000
  - [ ] Afviser negative tal
  - [ ] Afviser tekst/specialtegn
  - [ ] Default værdi (50) vises korrekt
  - [ ] Required field validation

- [ ] **Gennemsnitlig månedsløn:**
  - [ ] Accepterer værdier 0-200,000
  - [ ] Default værdi (38,000) vises korrekt
  - [ ] Afviser negative værdier
  - [ ] Formatering med danske tal (komma/punktum)

- [ ] **Slider Controls:**
  - [ ] Stress procent: 0-100% range virker
  - [ ] Sygefravær: 0-50 dage range virker
  - [ ] Produktivitetstab: 0-80% range virker
  - [ ] Live opdatering af værdier ved slider bevægelse
  - [ ] Keyboard navigation (pil taster) virker

#### **🧮 Beregnings Funktionalitet**
- [ ] **Grundlæggende beregning:**
  - [ ] "Beregn omkostninger" knap aktiverer beregning
  - [ ] Sygefravær omkostning beregnes korrekt
  - [ ] Produktivitetstab omkostning beregnes korrekt
  - [ ] Udskiftning af personale omkostning beregnes korrekt
  - [ ] Total omkostning summeres korrekt
  - [ ] Resultater vises i dansk valuta format (kr.)

- [ ] **Forbedret scenarie & ROI:**
  - [ ] Forbedring procent slider virker (0-100%)
  - [ ] Programomkostning input accepterer værdier
  - [ ] ROI beregnes korrekt
  - [ ] Besparelse beregnes korrekt
  - [ ] Sammenligning vises korrekt

#### **📊 Tabel Visning**
- [ ] **Resultat tabel:**
  - [ ] Sygefravær række vises korrekt
  - [ ] Produktivitetstab række vises korrekt
  - [ ] Udskiftning række vises korrekt
  - [ ] Total række fremhæves (rød farve)
  - [ ] Procent andele beregnes korrekt (sum = 100%)
  - [ ] Valuta formatering konsistent

#### **💾 State Management**
- [ ] **Local Storage:**
  - [ ] Input værdier gemmes ved ændringer
  - [ ] Værdier gendannes ved page reload
  - [ ] State ryddes korrekt ved reset

- [ ] **URL Parameters:**
  - [ ] Værdier reflekteres i URL
  - [ ] Sharing af URL bevarer indstillinger
  - [ ] Browser back/forward virker korrekt

### 🛡️ **GDPR & PRIVACY TESTS**

#### **🍪 Cookie Consent**
- [ ] **Popup funktionalitet:**
  - [ ] Vises automatisk ved første besøg
  - [ ] "Accept" knap gemmer consent
  - [ ] "Decline" knap deaktiverer tracking
  - [ ] Valg huskes mellem sessions
  - [ ] ESC tast lukker popup

- [ ] **Sprog support:**
  - [ ] Dansk oversættelse korrekt
  - [ ] Engelsk som fallback
  - [ ] Sprog dropdown virker
  - [ ] Text opdateres ved sprog skift

#### **🔒 Data Protection**
- [ ] Ingen sensitive data i localStorage
- [ ] Ingen PII data sendes til analytics
- [ ] IP adresser maskeres i frontend logs

### 📱 **RESPONSIVE DESIGN TESTS**

#### **💻 Desktop (1920x1080+)**
- [ ] Layout spredt korrekt over 2 kolonner
- [ ] Alle elementer synlige uden scroll
- [ ] Tooltips placeres korrekt
- [ ] Hover effekter virker smooth

#### **📱 Tablet (768x1024)**
- [ ] Layout tilpasser sig medium skærme
- [ ] Input felter beholder brugbarhed
- [ ] Sliders er lette at betjene med touch
- [ ] Navigation elementer tilgængelige

#### **📲 Mobile (375x667)**
- [ ] Single column layout aktiveres
- [ ] Tekst forbliver læsbar
- [ ] Touch targets er store nok (44px+)
- [ ] Horizontal scroll undgås
- [ ] Keyboard input virker på mobile

### 🎨 **UI/UX TESTS**

#### **🎯 Interaktivitet**
- [ ] **Loading states:**
  - [ ] Beregningsknap viser loading animation
  - [ ] Resultater opdateres smooth
  - [ ] Ingen flicker ved state changes

- [ ] **Error states:**
  - [ ] Validation errors vises under felter
  - [ ] Error beskeder er klare og hjælpsomme
  - [ ] Errors ryddes ved korrekt input

#### **♿ Accessibility**
- [ ] **Keyboard navigation:**
  - [ ] Tab order logisk gennem form
  - [ ] Focus indicators synlige
  - [ ] Enter aktiverer beregning
  - [ ] ESC lukker modals

- [ ] **Screen reader support:**
  - [ ] Labels associeret med inputs
  - [ ] ARIA attributes korrekte
  - [ ] Semantic HTML struktur
  - [ ] Alt text på ikoner

#### **⚡ Performance**
- [ ] Initial page load under 3 sekunder
- [ ] Beregning respons under 500ms
- [ ] Smooth animationer (60fps)
- [ ] Ingen memory leaks ved lang brug

---

## 🔧 **BACKEND API TESTS**

### 📨 **Data Collection Endpoint (`/api/collect`)**

#### **✅ Valid Requests**
```bash
# Test kommando:
curl -X POST https://your-domain.vercel.app/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "employees": 50,
    "industry": "IT & Teknologi",
    "salary": 45000,
    "stressPct": 65,
    "consent": true,
    "_hp": ""
  }'
```

- [ ] **Response struktur:**
  - [ ] Status 200 OK
  - [ ] `{"ok": true, "id": "entry_..."}` format
  - [ ] Unique ID genereres for hver entry
  - [ ] Response time under 1 sekund

- [ ] **Data validation:**
  - [ ] Employees clamped til 1-100,000
  - [ ] Salary clamped til 0-10,000,000
  - [ ] StressPct clamped til 0-100
  - [ ] Industry string max 60 chars

#### **🚫 Invalid Requests**
- [ ] **Manglende consent:**
  - [ ] `"consent": false` → 400 Bad Request
  - [ ] Error: "Consent required"

- [ ] **Honeypot detection:**
  - [ ] `"_hp": "spam"` → 200 OK (silent success)
  - [ ] Data ikke gemt ved honeypot trigger

- [ ] **Wrong method:**
  - [ ] GET request → 405 Method Not Allowed
  - [ ] PUT/DELETE → 405 Method Not Allowed

- [ ] **Malformed JSON:**
  - [ ] Invalid JSON → 400 Bad Request
  - [ ] Missing fields → Default values anvendes

### 🔐 **Admin Endpoints Tests**

#### **📊 Stats Endpoint (`/api/admin/stats`)**
```bash
# Test kommando:
curl -H "X-Admin-Key: YOUR_ADMIN_KEY" \
  https://your-domain.vercel.app/api/admin/stats
```

- [ ] **Authentication:**
  - [ ] Valid admin key → 200 OK
  - [ ] Invalid key → 401 Unauthorized
  - [ ] Missing key → 401 Unauthorized

- [ ] **Response data:**
  - [ ] `totalEntries` number
  - [ ] `industries` object med counts
  - [ ] `recentEntries` array
  - [ ] Realistic test data present

#### **📁 Code Viewer (`/api/admin/code-viewer`)**
```bash
# Test kommando:
curl -H "X-Admin-Key: YOUR_ADMIN_KEY" \
  "https://your-domain.vercel.app/api/admin/code-viewer?file=script.js"
```

- [ ] **File access:**
  - [ ] Whitelisted files accessible
  - [ ] Non-whitelisted files blocked
  - [ ] Directory traversal attacks blocked

- [ ] **Content delivery:**
  - [ ] File content returned correctly
  - [ ] Syntax highlighting metadata included
  - [ ] File list endpoint funktional

---

## 🏠 **ADMIN DASHBOARD TESTS**

### 🔐 **Authentication Flow**
- [ ] **Login process:**
  - [ ] Admin key input field present
  - [ ] Password visibility toggle virker
  - [ ] Enter key aktiverer login
  - [ ] Success redirect til dashboard

- [ ] **Session management:**
  - [ ] Login state bevares ved refresh
  - [ ] Logout fjerner session
  - [ ] Auto-logout ved invalid key

### 📊 **Dashboard Functionality**
- [ ] **Statistics display:**
  - [ ] Total entries count vises
  - [ ] Industry breakdown chart/liste
  - [ ] Recent entries tabel
  - [ ] Real-time data updates

- [ ] **Code viewer:**
  - [ ] File dropdown populated
  - [ ] File content loads correctly
  - [ ] Syntax highlighting active
  - [ ] Download functionality virker

- [ ] **Export features:**
  - [ ] CSV export genereres
  - [ ] JSON export genereres
  - [ ] Data format korrekt
  - [ ] Download triggers correctly

---

## 🌍 **CROSS-BROWSER TESTS**

### 🖥️ **Desktop Browsers**
- [ ] **Chrome/Chromium (latest):**
  - [ ] Alle features virker
  - [ ] Performance optimal
  - [ ] Console errors fraværende

- [ ] **Firefox (latest):**
  - [ ] CSS grid layout korrekt
  - [ ] JavaScript funktionalitet komplet
  - [ ] Form validation kompatibel

- [ ] **Safari (latest):**
  - [ ] Webkit-specific CSS virker
  - [ ] Touch events på trackpad
  - [ ] IOS compatibility

- [ ] **Edge (latest):**
  - [ ] Microsoft-specific features
  - [ ] Enterprise compatibility
  - [ ] Accessibility features

### 📱 **Mobile Browsers**
- [ ] **iOS Safari:**
  - [ ] Touch inputs responsive
  - [ ] Viewport scaling korrekt
  - [ ] No zoom on input focus

- [ ] **Android Chrome:**
  - [ ] Material design integration
  - [ ] Keyboard behavior correct
  - [ ] Swipe gestures

---

## 🚀 **DEPLOYMENT & PRODUCTION TESTS**

### ⚙️ **Vercel Deployment**
- [ ] **Build process:**
  - [ ] Serverless functions deploy correctly
  - [ ] Static assets optimized
  - [ ] Environment variables loaded
  - [ ] No build errors/warnings

- [ ] **Runtime validation:**
  - [ ] API endpoints accessible
  - [ ] HTTPS enforced
  - [ ] CDN distribution functional
  - [ ] Edge caching working

### 🌐 **Production Environment**
- [ ] **Domain configuration:**
  - [ ] Custom domain works (hvis relevant)
  - [ ] SSL certificate valid
  - [ ] Redirects configured correctly

- [ ] **Performance monitoring:**
  - [ ] Core Web Vitals optimized
  - [ ] LCP under 2.5s
  - [ ] FID under 100ms
  - [ ] CLS under 0.1

---

## 🧪 **SECURITY TESTS**

### 🛡️ **Input Sanitization**
- [ ] **XSS Protection:**
  - [ ] Script injection blocked
  - [ ] HTML injection sanitized
  - [ ] CSS injection prevented

- [ ] **SQL Injection:** (N/A - no database)
- [ ] **CSRF Protection:** Headers validated

### 🔒 **API Security**
- [ ] **Rate limiting:** (Configure if needed)
- [ ] **Admin key brute force protection**
- [ ] **CORS configuration appropriate**

---

## 📈 **ANALYTICS & MONITORING**

### 📊 **Vercel Analytics**
- [ ] **Page views tracked**
- [ ] **User interactions recorded**
- [ ] **Performance metrics collected**
- [ ] **Error tracking functional**

### 🍪 **GDPR Compliance**
- [ ] **Consent verification:**
  - [ ] Analytics disabled når declined
  - [ ] No tracking without consent
  - [ ] Cookie policy accessible

---

## ✅ **FINAL CHECKLIST**

### 🚀 **Pre-Launch Validation**
- [ ] Alle tests passed
- [ ] No console errors
- [ ] Performance optimized
- [ ] SEO meta tags complete
- [ ] GDPR compliance verified
- [ ] Mobile experience polished
- [ ] Admin functions secured
- [ ] Backup/monitoring in place

### 📋 **Post-Launch Monitoring**
- [ ] Real user data flowing
- [ ] Error rates acceptable
- [ ] Performance metrics good
- [ ] User feedback positive
- [ ] Admin dashboard functional

---

## 🛠️ **TEST AUTOMATION COMMANDS**

### Frontend Testing
```bash
# Start local server
python3 -m http.server 8080

# Test basic functionality
curl -I http://localhost:8080/
curl -I http://localhost:8080/admin.html
```

### API Testing
```bash
# Test collect endpoint (replace with real domain)
curl -X POST https://your-domain.vercel.app/api/collect \
  -H "Content-Type: application/json" \
  -d '{"employees":50,"industry":"IT","salary":45000,"stressPct":65,"consent":true,"_hp":""}'

# Test admin endpoints
curl -H "X-Admin-Key: YOUR_KEY" https://your-domain.vercel.app/api/admin/stats
```

### Performance Testing
```bash
# Lighthouse audit
npx lighthouse https://your-domain.vercel.app --output=html

# WebPageTest
# https://webpagetest.org/
```

---

## 📝 **NOTES & BEST PRACTICES**

### 🔄 **Regression Testing**
- Test efter hver major change
- Automated testing for kritiske flows
- Cross-browser testing ved releases

### 📊 **User Testing**
- A/B test forskellige UI approaches
- Feedback collection fra real users
- Accessibility testing med real screen readers

### 🔒 **Security Reviews**
- Regular security audits
- Dependency vulnerability scans
- GDPR compliance reviews

---

**Total Tests: 100+ checkpoints**
**Estimated Testing Time: 4-6 timer for komplet gennemgang**
**Critical Path Tests: ~45 minutter**
